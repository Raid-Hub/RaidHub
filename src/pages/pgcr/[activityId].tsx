import React from 'react';
import { NextPageContext } from 'next'
import { BungieNetClient } from '../../util/bungie-client'
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import ActivityHeader from '../../components/pgcr/ActivityHeader'
import { PGCREntries } from '../../components/pgcr/Entries'
import SummaryStats from '../../components/pgcr/SummaryStats'
import { DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas'
import styles from '../../styles/pgcr.module.css';
import { PGCRCharacter, PGCRMember } from '../../models/pgcr/Entry';
import { Backdrop, Raid } from '../../util/raid';
import { ActivityPlacements, fetchActivityPlacements } from '../../util/server-connection';
import { Activity } from '../../models/pgcr/Activity';
import { Tag } from '../../util/tags';
import Error from '../../components/Error';

type PGCRProps = {
  activityId: string
}

export type PGCRComponent = {
  members?: PGCRMember[]
  emblems?: { [characterId: string]: string }
  placements?: ActivityPlacements
  activity?: Activity
}

export default class PGCR extends React.Component<PGCRProps, PGCRComponent & { error?: string }> {
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

    this.placementsPromise = fetchActivityPlacements(this.props.activityId)
      .catch((e) => { console.error(e); return {} })

    let pgcr;
    try {
      pgcr = await pgcrPromise
    } catch (e: any) {
      this.setState({ error: e.message })
      return
    }

    const dict: Record<string, DestinyPostGameCarnageReportEntry[]> = {}
    /** Group characters by member */
    pgcr.entries.forEach(entry => (dict[entry.player.destinyUserInfo.membershipId] ??= []).push(entry))
    /** Sort each member's characters by latest start time, and always keep the completed one first*/
    const members: PGCRMember[] = Object.entries(dict).map(([_, vals]) => new PGCRMember(vals.sort((charA, charB) => {
      if (charA.values.completed.basic.value) return -1;
      else if (charB.values.completed.basic.value) return 1;
      else return charB.values.startSeconds.basic.value - charA.values.startSeconds.basic.value
      /* Sort member by completion then (kdr * kills) */
    }))).sort((memA, memB) => {
      if (!memA.didComplete || !memB.didComplete && (memA.didComplete || memB.didComplete)) return !memA.didComplete ? 1 : -1
      else return (memB.stats.kdr * memB.stats.kills) - (memA.stats.kdr * memA.stats.kills)})

    const activity = new Activity(pgcr, members)
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
        {this.state.error ? <Error message={this.state.error}/> : <></>}
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