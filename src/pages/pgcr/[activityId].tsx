import React from "react"
import ActivityHeader from "../../components/pgcr/ActivityHeader"
import PGCREntries from "../../components/pgcr/Entries"
import SummaryStats from "../../components/pgcr/SummaryStats"
import styles from "../../styles/pgcr.module.css"
import { Backdrop, Raid, Short } from "../../util/raid"
import Error from "../../components/Error"
import { usePGCR } from "../../hooks/pgcr"
import { usePlacements } from "../../hooks/placements"
import Head from "next/head"

type PGCRProps = {
    activityId: string
}

const PGCR = ({ activityId }: PGCRProps) => {
    const {
        activity,
        members,
        error: pgcrError,
        loadingState: pgcrLoadingState
    } = usePGCR(activityId)
    const { placements, error: placementError } = usePlacements(activityId)

    return (
        <main className={styles["main"]}>
            <Head>
                <title>
                    {activity?.raid ? `${Short[activity.raid]} ${activityId} | RaidHub` : "RaidHub"}
                </title>
            </Head>
            {pgcrError && <Error message={pgcrError} />}
            <section
                className={[
                    styles["summary-card"],
                    styles["main-element"],
                    styles["soft-rectangle"]
                ].join(" ")}>
                <div className="background-img" style={Backdrop[activity?.raid ?? Raid.NA]} />
                <ActivityHeader
                    activity={activity}
                    placements={placements}
                    pgcrLoadingState={pgcrLoadingState}
                />
                <PGCREntries
                    raid={activity?.raid ?? Raid.NA}
                    members={members}
                    pgcrLoadingState={pgcrLoadingState}
                />
            </section>
            <section className={[styles["summary-stats"], styles["main-element"]].join(" ")}>
                <SummaryStats activity={activity} />
            </section>
        </main>
    )
}

export async function getServerSideProps({ params }: { params: { activityId: string } }) {
    const { activityId } = params
    return { props: { activityId } }
}

export default PGCR
