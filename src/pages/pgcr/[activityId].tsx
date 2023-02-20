import React from 'react';
import { NextPageContext } from 'next'
import { DestinyClient } from '../../server/client'
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ActivityHeader } from '../../components/pgcr/ActivityHeader'
import { PGCREntries } from '../../components/pgcr/PGCREntries'
import { SummaryStats } from '../../components/pgcr/SummaryStats'
import { DestinyPostGameCarnageReportData } from 'oodestiny/schemas'
import styles from '../../styles/pgcr.module.css';

type PGCRProps = {
  activityId: string
}

export type PGCRComponentProps = {
  pgcr: DestinyPostGameCarnageReportData | null
  emblems?: { [characterId: string]: string } | null
}

type PGCRState = {
  pgcr: DestinyPostGameCarnageReportData | null,
  emblems: { [characterId: string]: string } | null
}
export default class PGCR extends React.Component<PGCRProps, PGCRState> {

  constructor(props: PGCRProps) {
    super(props)
    this.state = {
      pgcr: null,
      emblems: null
    }
  }

  static async getInitialProps(ctx: NextPageContext) {
    const { activityId } = ctx.query;
    return { activityId };
  }

  async componentDidMount() {
    const { activityId } = this.props;
    const client = new DestinyClient();
    const pgcr = await client.getPGCR(activityId)
    this.setState({ pgcr }, async () => {
      const uniqueProfiles = this.state.pgcr?.entries.filter(
        (membership, index, self) =>
          index === self.findIndex((m) => (
            m.player.destinyUserInfo.membershipId === membership.player.destinyUserInfo.membershipId
            && m.player.destinyUserInfo.membershipType === membership.player.destinyUserInfo.membershipType))
      );
      const emblems = await Promise.all(uniqueProfiles?.map(profile => (
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
            <ActivityHeader pgcr={this.state.pgcr} />
            <PGCREntries pgcr={this.state.pgcr} emblems={this.state.emblems} />
          </section>
          <section id={styles["summary-stats"]} className={styles["main-element"]}>
            <SummaryStats pgcr={this.state.pgcr} />
          </section>
        </main>
        <Footer />
      </>
    );
  }
}
