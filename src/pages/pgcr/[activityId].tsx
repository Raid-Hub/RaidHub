import React from 'react';
import { NextPageContext } from 'next'
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import ActivityHeader from '../../components/pgcr/ActivityHeader'
import PGCREntries from '../../components/pgcr/Entries'
import SummaryStats from '../../components/pgcr/SummaryStats'
import styles from '../../styles/pgcr.module.css';
import { Backdrop, Raid } from '../../util/raid';
import Error from '../../components/Error';
import { usePGCR } from '../../hooks/pgcr';
import { usePlacements } from '../../hooks/placements';
import { useEmblems } from '../../hooks/emblems';

interface PGCRProps {
  activityId: string
}

const PGCR = ({ activityId }: PGCRProps) => {
  const { activity, members, error: pgcrError } = usePGCR(activityId)
  const { placements, error: placementError } = usePlacements(activityId)
  const { emblems, error: emblemError } = useEmblems(members
    ?.map(({membershipId, membershipType, characterIds}) => ({membershipId, membershipType, characterId: characterIds[0]})))

  return (
    <>
      <Header />
      <main id={styles.content}>
        {pgcrError ? <Error message={pgcrError} /> : <></>}
        <section id={styles["summary-card"]} className={[styles["main-element"], styles["soft-rectangle"]].join(' ')}>
          <div id={styles["summary-card-bg"]}
            style={{ backgroundImage: `url(/backdrops${Backdrop[activity?.name ?? Raid.NA]})` }}
            className={styles["bg"]}>
            <ActivityHeader
              activity={activity}
              placements={placements} />
            <PGCREntries
              raid={activity?.name ?? Raid.NA}
              members={members}
              emblems={emblems} />
          </div>
        </section>
        <section id={styles["summary-stats"]} className={styles["main-element"]}>
          <SummaryStats activity={activity} />
        </section>
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps({ params }: { params: { activityId: string } }) {
  const { activityId } = params;
  return { props: { activityId } }
}

export default PGCR;