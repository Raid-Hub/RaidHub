import React, { useEffect, useState } from "react"
import ActivityHeader from "../../components/pgcr/ActivityHeader"
import Participants from "../../components/pgcr/Participants"
import SummaryStats from "../../components/pgcr/SummaryStats"
import styles from "../../styles/pgcr.module.css"
import { Backdrop, Raid, Short } from "../../util/destiny/raid"
import { usePGCR } from "../../hooks/bungie/usePGCR"
import Head from "next/head"
import { GetServerSidePropsContext, NextPage } from "next"
import ErrorComponent from "../../components/global/Error"
import { ParsedUrlQuery } from "querystring"

type PGCRProps = {
    activityId: string
    query: ParsedUrlQuery
}

const PGCR: NextPage<PGCRProps> = ({ activityId, query }) => {
    const [error, setError] = useState<Error | null>(null)
    const {
        activity,
        members,
        loadingState: pgcrLoadingState
    } = usePGCR({ activityId, errorHandler: setError })

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
            <section className={styles["summary-card"]}>
                <div className="background-img" style={Backdrop[activity?.raid ?? Raid.NA]} />
                <ActivityHeader activity={activity} pgcrLoadingState={pgcrLoadingState} />
                <Participants
                    raid={activity?.raid ?? Raid.NA}
                    members={members}
                    query={query}
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
    params,
    query
}: GetServerSidePropsContext): Promise<{ props: PGCRProps }> {
    const activityId = params!.activityId as string
    return { props: { activityId, query } }
}

export default PGCR
