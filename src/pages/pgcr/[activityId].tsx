import { createContext, useContext } from "react"
import { GetStaticProps, NextPage } from "next"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { z } from "zod"
import DestinyPGCR from "../../models/pgcr/PGCR"
import ErrorComponent from "../../components/global/Error"
import PGCR from "../../components/pgcr/PGCR"
import { useBungieClient } from "~/components/app/TokenManager"
import { QueryObserverLoadingResult, QueryObserverSuccessResult } from "@tanstack/react-query"
import Head from "next/head"
import { useLocale } from "~/components/app/LocaleManager"
import { Short } from "~/util/destiny/raidUtils"
import { toCustomDateString } from "~/util/presentation/formatting"
import { useRaidHubActivity } from "~/hooks/raidhub/useRaidHubActivity"

const PgcrContext = createContext<
    | ((QueryObserverSuccessResult<DestinyPGCR> | QueryObserverLoadingResult<DestinyPGCR>) & {
          activityId: string
      })
    | null
>(null)

export const usePGCRContext = () => {
    const ctx = useContext(PgcrContext)
    if (!ctx) throw new Error("Cannot access pgcr out of context")
    return ctx
}

type PGCRPageProps = {
    activityId: string
}
const PGCRPage: NextPage<PGCRPageProps> = ({ activityId }) => {
    const bungie = useBungieClient()
    const query = bungie.pgcr.useQuery({ activityId }, { staleTime: Infinity })
    const { data: activity } = useRaidHubActivity(activityId)

    const { strings, locale } = useLocale()
    return query.isError ? (
        <ErrorComponent error={CustomError.handle(query.error, ErrorCode.PGCR)} />
    ) : (
        <PgcrContext.Provider value={{ activityId, ...query }}>
            <Head>
                {query.data?.raid && activity && (
                    <>
                        <title key="title">
                            {Short[query.data.raid]} {query.data.activityDetails.instanceId} |
                            RaidHub
                        </title>
                        <meta
                            key="og-title"
                            property="og:title"
                            content={`${strings.raidNames[query.data.raid]} ${
                                query.data.activityDetails.instanceId
                            }`}
                        />
                        <meta
                            key="description"
                            name="description"
                            content={`${query.data.title(
                                strings,
                                activity
                            )} completed on ${toCustomDateString(
                                query.data.completionDate,
                                locale
                            )}`}
                        />
                        <meta
                            key="og-descriptions"
                            property="og:description"
                            content={`${query.data.title(
                                strings,
                                activity
                            )} completed on ${toCustomDateString(
                                query.data.completionDate,
                                locale
                            )}`}
                        />
                        <meta
                            name="date"
                            content={query.data.completionDate.toISOString().slice(0, 10)}
                        />
                    </>
                )}
            </Head>
            <PGCR />
        </PgcrContext.Provider>
    )
}

export default PGCRPage

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps<PGCRPageProps> = async ({ params }) => {
    try {
        const props = z
            .object({
                activityId: z.string().regex(/^\d+$/)
            })
            .parse(params)
        return {
            props
        }
    } catch {
        return { notFound: true }
    }
}
