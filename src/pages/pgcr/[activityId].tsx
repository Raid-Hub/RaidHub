import React from 'react';
import { NextPageContext } from 'next'
import { BungieNetClient, CharacterProps } from '../../util/bungie-client'
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import ActivityHeader from '../../components/pgcr/ActivityHeader'
import { PGCREntries } from '../../components/pgcr/PGCREntries'
import SummaryStats from '../../components/pgcr/SummaryStats'
import { DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas'
import styles from '../../styles/pgcr.module.css';
import { PGCRCharacter, PGCRMember } from '../../models/pgcr/Entry';
import { Backdrop, Raid } from '../../util/raid';
import { ActivityPlacements, fetchActivityPlacements } from '../../util/server-connection';
import { ActivityData } from '../../models/pgcr/ActivityData';
import { Tag } from '../../util/tags';

type PGCRProps = {
  activityId: string
}

export type PGCRComponent = {
  members?: PGCRMember[]
  emblems?: { [characterId: string]: string }
  placements?: ActivityPlacements
  activity?: ActivityData
}

export default class PGCR extends React.Component<PGCRProps, PGCRComponent> {
  private placementsPromise: Promise<Partial<Record<Tag, number>>> | undefined
  private client: BungieNetClient

  constructor(props: PGCRProps) {
    super(props)
    this.state = {}
    this.client = new BungieNetClient();
  }

  static async getInitialProps(ctx: NextPageContext) {
    const { activityId } = ctx.query;
    return { activityId };
  }

  async componentDidMount() {

    const pgcrPromise = this.client.getPGCR(this.props.activityId)
      .catch((e) => { console.error(e); return null })
      .finally(console.log)

    this.placementsPromise = fetchActivityPlacements(this.props.activityId)
      .catch((e) => { console.error(e); return {} })
      .finally(console.log)

    const pgcr = await pgcrPromise;
    if (!pgcr) {
      // TODO: handle what to do if no pgcr
      return;
    }

    const dict: Record<string, DestinyPostGameCarnageReportEntry[]> = {}
    pgcr.entries.forEach(entry => (dict[entry.player.destinyUserInfo.membershipId] ??= []).push(entry))
    /** Sort characters by kills, but always keep the final one first*/
    const members: PGCRMember[] = Object.entries(dict).map(([_, vals]) => new PGCRMember(vals.sort((a, b) => {
      if (a.values.completed.basic.value) return -1;
      else if (b.values.completed.basic.value) return 1;
      else return b.values.kills.basic.value - a.values.kills.basic.value
      /* Sort by (kdr * kills) */
    }))).sort((a, b) => (b.stats.kdr * b.stats.kills) - (a.stats.kdr * a.stats.kills))

    const activity = new ActivityData(pgcr, members)
    this.setState({ activity, members }, this.followUp)
  }

  async followUp() {
    /** Send the placements when ready */
    this.placementsPromise?.then(placements => this.setState({ placements }))
    /** Once the pgcr has been set, find the emblems and set those */
    const emblems = await Promise.all(this.state.members
      ?.reduce((characters, member) => characters.concat(member.characters), new Array<PGCRCharacter>())
      .map(character => (
        this.client.getCharacterEmblem(character.id, character.membershipId, character.membershipType)
          .then((emblem): [string, string] => ([character.id, emblem]))
      ))
      ?? [])
      .then((pairs): Record<string, string> => Object.fromEntries(pairs))
    this.setState({ emblems })
  }

  render() {
    return (
      <>
        <Header />
        <main id={styles.content}>
          <section id={styles["summary-card"]} className={[styles["main-element"], styles["soft-rectangle"]].join(' ')}>
            <div id={styles["summary-card-bg"]}
              style={{ backgroundImage: `url(/backdrops${Backdrop[this.state.activity?.name ?? Raid.NA]})` }}
              className={styles["bg"]}>
              <ActivityHeader
                activity={this.state.activity}
                placements={this.state.placements} />
              <PGCREntries
                raid={this.state.activity?.name ?? Raid.NA}
                members={this.state.members}
                emblems={this.state.emblems} />
            </div>
          </section>
          <section id={styles["summary-stats"]} className={styles["main-element"]}>
            <SummaryStats activity={this.state.activity} />
          </section>
        </main>
        <Footer />
      </>
    );
  }
}