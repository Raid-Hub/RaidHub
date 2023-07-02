import { useState } from "react"
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
    const { pgcr, loadingState: pgcrLoadingState } = usePGCR({ activityId, errorHandler: setError })

    if (error) {
        return (
            <ErrorComponent
                error={error}
                title={
                    pgcr?.details.raid
                        ? `${Short[pgcr.details.raid]} ${activityId} | RaidHub`
                        : "RaidHub"
                }
            />
        )
    } else {
        return (
            <main className={styles["main"]}>
                <Head>
                    <title>
                        {pgcr?.details?.raid
                            ? `${Short[pgcr.details.raid]} ${activityId} | RaidHub`
                            : "RaidHub"}
                    </title>
                </Head>
                <section className={styles["summary-card"]}>
                    <div
                        className="background-img"
                        style={Backdrop[pgcr?.details?.raid ?? Raid.NA]}
                    />
                    <ActivityHeader activity={pgcr} pgcrLoadingState={pgcrLoadingState} />
                    <Participants
                        raid={pgcr?.details?.raid ?? Raid.NA}
                        members={pgcr?.players ?? []}
                        query={query}
                        pgcrLoadingState={pgcrLoadingState}
                        errorHandler={setError}
                    />
                </section>
                <section className={styles["summary-stats"]}>
                    <SummaryStats activity={pgcr} />
                </section>
            </main>
        )
    }
}

export async function getServerSideProps({
    params,
    query
}: GetServerSidePropsContext): Promise<{ props: PGCRProps }> {
    const activityId = params!.activityId as string
    return { props: { activityId, query } }
}

export default PGCR
