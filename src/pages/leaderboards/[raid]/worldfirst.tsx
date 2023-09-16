import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { Hydrate, useQuery } from "@tanstack/react-query"
import { useLocale } from "~/components/app/LocaleManager"
import LeaderboardComponent from "~/components/leaderboards/Leaderboard"
import { ReleaseDate, UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { toCustomDateString } from "~/util/presentation/formatting"
import { Leaderboard, getLeaderboard, leaderbordQueryKey } from "~/services/raidhub/getLeaderboard"
import { usePage } from "~/hooks/util/usePage"
import { zRaidURIComponent } from "~/util/zod"
import { prefetchLeaderboard } from "~/server/serverQueryClient"
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
        const { raid } = zRaidURIComponent.parse(params)

        const paramStrings = [
            (RaidsWithReprisedContest as readonly ListedRaid[]).includes(raid)
                ? "challenge"
                : "normal"
        ]

        const { staleTime, dehydratedState } = await prefetchLeaderboard(
            raid,
            Leaderboard.WorldFirst,
            paramStrings,
            2
        )

        return {
            props: {
                raid,
                dehydratedState
            },
            revalidate: staleTime / 1000
            // revalidate takes seconds, so divide by 1000
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
        queryKey: leaderbordQueryKey(raid, Leaderboard.WorldFirst, params, page),
        queryFn: () => getLeaderboard(raid, Leaderboard.WorldFirst, params, page)
    })

    const title = `${raidName} | World First Leaderboards`
    const raidDate = toCustomDateString(ReleaseDate[raid], locale)
    const description = `World First Leaderboards for ${raidName} on ${raidDate}`
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
                <meta name="date" content={ReleaseDate[raid].toISOString().slice(0, 10)} />
            </Head>

            <LeaderboardComponent
                entries={query.data?.entries ?? []}
                isLoading={query.isLoading}
                page={page}
                setPage={setPage}>
                <WorldFirstHeader
                    title={"World First " + raidName}
                    subtitle={raidDate}
                    raid={raid}
                />
            </LeaderboardComponent>
        </>
    )
}
