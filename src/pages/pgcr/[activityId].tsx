import React, { useState } from "react"
import ActivityHeader from "../../components/pgcr/ActivityHeader"
import PGCREntries from "../../components/pgcr/Participants"
import SummaryStats from "../../components/pgcr/SummaryStats"
import styles from "../../styles/pgcr.module.css"
import { Backdrop, Raid, Short } from "../../util/raid"
import { usePGCR } from "../../hooks/pgcr"
import { usePlacements } from "../../hooks/placements"
import Head from "next/head"
import { NextPage } from "next"
import ErrorComponent from "../../components/Error"

type PGCRProps = {
    activityId: string
}

const PGCR: NextPage<PGCRProps> = ({ activityId }) => {
    const [error, setError] = useState<Error | null>(null)
    const {
        activity,
        members,
        loadingState: pgcrLoadingState
    } = usePGCR({ activityId, errorHandler: setError })
    const { placements } = usePlacements({ activityId, errorHandler: setError })

    if (error) {
        return (
            <ErrorComponent
                error={error}
                title={
                    activity?.raid ? `${Short[activity.raid]} ${activityId} | RaidHub` : "RaidHub"
                }
            />
        )
    }

    return (
        <main className={styles["main"]}>
            <Head>
                <title>
                    {activity?.raid ? `${Short[activity.raid]} ${activityId} | RaidHub` : "RaidHub"}
                </title>
            </Head>
            <section className={[styles["summary-card"], styles["soft-rectangle"]].join(" ")}>
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
                    errorHandler={setError}
                />
            </section>
            <section className={styles["summary-stats"]}>
                <SummaryStats activity={activity} />
            </section>
        </main>
    )
}

export async function getServerSideProps({
    params
}: {
    params: { activityId: string }
}): Promise<{ props: PGCRProps }> {
    const { activityId } = params
    return { props: { activityId } }
}

export default PGCR
