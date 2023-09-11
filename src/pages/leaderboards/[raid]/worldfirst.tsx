import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import LeaderboardComponent from "../../../components/leaderboards/Leaderboard"
import Head from "next/head"
import { ListedRaid, RaidsWithReprisedContest } from "../../../types/raids"
import { RaidToUrlPaths, ReleaseDate, UrlPathsToRaid } from "../../../util/destiny/raidUtils"
import { useLocale } from "../../../components/app/LocaleManager"
import { toCustomDateString } from "../../../util/presentation/formatting"
import { z } from "zod"
import { QueryClient, Hydrate, dehydrate, useQuery } from "@tanstack/react-query"
import { Leaderboard, getLeaderboard, leaderbordQueryKey } from "~/services/raidhub/getLeaderboard"
import { usePage } from "../../../hooks/util/usePage"
import { parseRaidFromParams } from "~/util/zod"
import { prefetchLeaderboard } from "~/server/serverQueryClient"

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
        const raid = parseRaidFromParams(params)

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

const WorldsFirstLeaderboadPage: NextPage<WorldsFirstLeaderboadProps> = ({
    raid,
    dehydratedState
}) => {
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

    return (
        <>
            <Head>
                <title>{`${raidName} | World First Leaderboards`}</title>
            </Head>

            <LeaderboardComponent
                title={"World First " + raidName}
                subtitle={toCustomDateString(ReleaseDate[raid], locale)}
                raid={raid}
                entries={query.data?.entries ?? []}
                isLoading={query.isLoading}
                type={"API"}
                page={page}
                setPage={setPage}
            />
        </>
    )
}

export default WorldsFirstLeaderboadPage
