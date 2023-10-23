import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { Hydrate, dehydrate, useQuery } from "@tanstack/react-query"
import { useLocale } from "~/components/app/LocaleManager"
import LeaderboardComponent from "~/components/leaderboards/Leaderboard"
import { UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { toCustomDateString } from "~/util/presentation/formatting"
import { Leaderboard, getLeaderboard, leaderboardQueryKey } from "~/services/raidhub/getLeaderboard"
import { usePage } from "~/hooks/util/usePage"
import { zRaidURIComponent } from "~/util/zod"
import { createServerSideQueryClient, prefetchLeaderboard } from "~/server/serverQueryClient"
import { ListedRaid, RaidsWithReprisedContest } from "~/types/raids"
import WorldFirstHeader from "~/components/leaderboards/WorldFirstHeader"

type WorldsFirstLeaderboadProps = {
    raid: ListedRaid
    dehydratedState: unknown
}

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return process.env.APP_ENV === "local"
        ? {
              paths: [],
              fallback: "blocking"
          }
        : {
              paths: Object.keys(UrlPathsToRaid).map(raid => ({
                  params: {
                      raid
                  }
              })),
              fallback: false
          }
}

export const getStaticProps: GetStaticProps<WorldsFirstLeaderboadProps, { raid: string }> = async ({
    params
}) => {
    try {
        const raid = zRaidURIComponent.parse(params?.raid)

        const paramStrings = [
            (RaidsWithReprisedContest as readonly ListedRaid[]).includes(raid)
                ? "challenge"
                : "normal"
        ]

        const queryClient = createServerSideQueryClient()
        await prefetchLeaderboard(
            {
                raid: raid,
                board: Leaderboard.WorldFirst,
                params: paramStrings,
                pages: 2
            },
            queryClient
        )

        return {
            props: {
                raid,
                dehydratedState: dehydrate(queryClient)
            },
            revalidate: 3600 * 24 // 24 hours
        }
    } catch (e) {
        console.error(e)
        return { notFound: true }
    }
}

export default function WorldsFirstLeaderboadPage({
    raid,
    dehydratedState
}: WorldsFirstLeaderboadProps) {
    return (
        <Hydrate state={dehydratedState}>
            <WorldsFirstLeaderboad raid={raid} />
        </Hydrate>
    )
}

const WorldsFirstLeaderboad = ({ raid }: { raid: ListedRaid }) => {
    const { strings, locale } = useLocale()
    const [page, setPage] = usePage()
    const raidName = strings.raidNames[raid]
    const params = [
        (RaidsWithReprisedContest as readonly ListedRaid[]).includes(raid) ? "challenge" : "normal"
    ]
    const query = useQuery({
        queryKey: leaderboardQueryKey(raid, Leaderboard.WorldFirst, params, page),
        queryFn: () => getLeaderboard(raid, Leaderboard.WorldFirst, params, page)
    })

    const title = `${raidName} | World First Leaderboards`
    const date = query.data?.date ? new Date(query.data.date) : null
    const raidDate = date ? toCustomDateString(date, locale) : ""
    const description = `World First Race Leaderboards for ${raidName} on ${raidDate}`
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
                <meta name="date" content={date?.toISOString().slice(0, 10)} />
            </Head>

            <LeaderboardComponent
                entries={query.data?.entries ?? []}
                isLoading={query.isLoading}
                page={page}
                setPage={setPage}
                refresh={query.refetch}>
                <WorldFirstHeader
                    title={"World First " + raidName}
                    subtitle={raidDate}
                    raid={raid}
                />
            </LeaderboardComponent>
        </>
    )
}
