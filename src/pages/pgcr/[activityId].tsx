import React from 'react';
import { NextPageContext } from 'next'
import { DestinyClient } from '../../server/client'
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ActivityHeader } from '../../components/ActivityHeader'
import { PGCREntries } from '../../components/PGCREntries'
import { DestinyPostGameCarnageReportData } from 'oodestiny/schemas'
import styles from '../../styles/pgcr.module.css';

type PGCRProps = {
  activityId: string
}

export type PGCRComponentProps = {
  data: DestinyPostGameCarnageReportData | null
}

export default class PGCR extends React.Component<PGCRProps> {
  state: {
    pgcr: DestinyPostGameCarnageReportData | null
  }

  constructor(props: PGCRProps) {
    super(props)
    this.state = {
      pgcr: null
    }
  }

  static async getInitialProps(ctx: NextPageContext) {
    const { activityId } = ctx.query;
    return { activityId };
  }

  componentDidMount() {
    const { activityId } = this.props;
    const client = new DestinyClient();
    client.getPGCR(activityId).then(pgcr => {
      console.log(pgcr)
      this.setState({ pgcr })
    });
  }

  render() {
    return (
      <>
        <Header />
        <main id={styles.content}>
          <section id={styles["summary-card"]} className={[styles["main-element"], styles["soft-rectangle"]].join(' ')}>
            <ActivityHeader data={this.state.pgcr} />
            <PGCREntries data={this.state.pgcr} />
          </section>
          <section id={styles["summary-stats"]} className={styles["main-element"]}></section>
        </main>
        <Footer />
      </>
    );
  }
}
