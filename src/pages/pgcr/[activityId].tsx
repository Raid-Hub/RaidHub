import React from 'react';
import ActivityHeader from '../../components/pgcr/ActivityHeader'
import PGCREntries from '../../components/pgcr/Entries'
import SummaryStats from '../../components/pgcr/SummaryStats'
import styles from '../../styles/pgcr.module.css';
import { Backdrop, Raid } from '../../util/raid';
import Error from '../../components/Error';
import { usePGCR } from '../../hooks/pgcr';
import { usePlacements } from '../../hooks/placements';

type PGCRProps = {
  activityId: string
}

const PGCR = ({ activityId }: PGCRProps) => {
  const { activity, members, error: pgcrError } = usePGCR(activityId)
  const { placements, error: placementError } = usePlacements(activityId)

  return (
    <main className={styles["main"]}>
      {pgcrError && <Error message={pgcrError} />}
      <section id={styles["summary-card"]} className={[styles["main-element"], styles["soft-rectangle"]].join(' ')}>
          <div className="background-img" style={Backdrop[activity?.raid ?? Raid.NA]}/>
          <ActivityHeader
            activity={activity}
            placements={placements} />
          <PGCREntries
            raid={activity?.raid ?? Raid.NA}
            members={members} />
      </section>
      <section id={styles["summary-stats"]} className={styles["main-element"]}>
        <SummaryStats activity={activity} />
      </section>
    </main>
  );
}

export async function getServerSideProps({ params }: { params: { activityId: string } }) {
  const { activityId } = params;
  return { props: { activityId } }
}

export default PGCR;