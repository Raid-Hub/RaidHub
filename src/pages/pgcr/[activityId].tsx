import React from 'react';
import { NextPageContext } from 'next'
import { BungieNetClient } from '../../util/client'
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ActivityHeader } from '../../components/pgcr/ActivityHeader'
import { PGCREntries } from '../../components/pgcr/PGCREntries'
import { SummaryStats } from '../../components/pgcr/SummaryStats'
import { DestinyPostGameCarnageReportData, DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas'
import styles from '../../styles/pgcr.module.css';
import { PGCRMember } from '../../models/pgcr/Entry';

type PGCRProps = {
  activityId: string
}

export type PGCRComponent = {
  pgcr?: DestinyPostGameCarnageReportData | null
  members?: PGCRMember[] | null,
  emblems?: { [characterId: string]: string } | null
}

export default class PGCR extends React.Component<PGCRProps, PGCRComponent> {

  constructor(props: PGCRProps) {
    super(props)
    this.state = {
      pgcr: null,
      members: null,
      emblems: null
    }
  }

  static async getInitialProps(ctx: NextPageContext) {
    const { activityId } = ctx.query;
    return { activityId };
  }

  async componentDidMount() {
    const client = new BungieNetClient();
    let pgcr: DestinyPostGameCarnageReportData
    try {
      pgcr = await client.getPGCR(this.props.activityId)
      console.log(pgcr)
    } catch (e) {
      // TODO: handle errors here
      return;
    }
    const dict: Record<string, DestinyPostGameCarnageReportEntry[]> = {}
    pgcr.entries.forEach(entry => (dict[entry.player.destinyUserInfo.membershipId] ??= []).push(entry))
    /** Sort characters by kills, but always keep the final one first*/
    const members: PGCRMember[] = Object.entries(dict).map(([_, vals]) => new PGCRMember(vals.sort((a, b) => {
      if (a.values.completed.basic.value) return -1;
      else if (b.values.completed.basic.value) return 1;
      else return b.values.kills.basic.value - a.values.kills.basic.value
      /* Sort by kdr * kills */
    }))).sort((a, b) => (b.stats.kdr * b.stats.kills) - (a.stats.kdr * a.stats.kills))
    this.setState({ pgcr, members }, async () => {
      /** Once the pgcr has been set, find the emblems and set those */
      const emblems = await Promise.all(this.state.pgcr?.entries?.map(profile => (
        client.getCharacterEmblem(profile.characterId, profile.player.destinyUserInfo.membershipId, profile.player.destinyUserInfo.membershipType)
          .then(path => ([profile.characterId, path]))))
        ?? []).then(all => Object.fromEntries(all))
      this.setState({ emblems })
    })
  }

  render() {
    return (
      <>
        <Header />
        <main id={styles.content}>
          <section id={styles["summary-card"]} className={[styles["main-element"], styles["soft-rectangle"]].join(' ')}>
            <ActivityHeader pgcr={this.state.pgcr} members={this.state.members} />
            <PGCREntries members={this.state.members} emblems={this.state.emblems} />
          </section>
          <section id={styles["summary-stats"]} className={styles["main-element"]}>
            <SummaryStats pgcr={this.state.pgcr} members={this.state.members} />
          </section>
        </main>
        <Footer />
      </>
    );
  }
}
