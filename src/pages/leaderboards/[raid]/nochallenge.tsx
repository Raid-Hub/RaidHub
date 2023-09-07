import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Leaderboard from "../../../components/leaderboards/Leaderboard"
import Head from "next/head"
import {
    ListedRaid,
    RaidToUrlPaths,
    RaidsWithReprisedContest,
    ReprisedRaid,
    UrlPathsToRaid
} from "../../../types/raids"
import { ReleaseDate } from "../../../util/destiny/raid"
import { useLocale } from "../../../components/app/LocaleManager"
import { toCustomDateString } from "../../../util/presentation/formatting"
import { z } from "zod"
import { QueryClient, Hydrate, dehydrate, useQuery } from "@tanstack/react-query"
import { getLeaderboard } from "../../../services/raidhub/getLeaderboard"
import { usePage } from "../../../hooks/util/usePage"
import { LeaderboardMeta } from "~/types/leaderboards"

type NoChallengeContestLeaderboadProps = {
    raid: ListedRaid
    dehydratedState: unknown
}

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return process.env.APP_ENV !== "local"
        ? {
              paths: Object.entries(UrlPathsToRaid)
                  .filter(([path, raid]) => RaidsWithReprisedContest.includes(raid as ReprisedRaid))
                  .map(([path, raid]) => ({
                      params: {
                          raid: path
                      }
                  })),
              fallback: false
          }
        : {
              paths: [],
              fallback: "blocking"
          }
}

export const getStaticProps: GetStaticProps<
    NoChallengeContestLeaderboadProps,
    { raid: string }
> = async ({ params }) => {
    try {
        const { raid: path } = z
            .object({
                raid: z.string().refine(key => key in UrlPathsToRaid)
            })
            .parse(params) as {
            raid: keyof typeof UrlPathsToRaid
        }
        const raid = UrlPathsToRaid[path]
        if (!RaidsWithReprisedContest.includes(raid as ReprisedRaid)) {
            return { notFound: true }
        }

        const queryClient = new QueryClient()

        const paramsStrings = ["worldsfirst", RaidToUrlPaths[raid], "normal"]

        // we prefetch the first page at build time
        const staleTime = 24 * 60 * 60 * 1000 // 24 hours
        await queryClient.prefetchQuery(
            ["worldsfirst", RaidToUrlPaths[raid], 0],
            () => getLeaderboard(paramsStrings, 0),
            {
                staleTime
            }
        )

        // clear the static query if it's not marked as complete
        const prefetched = queryClient.getQueryData<LeaderboardMeta>([
            "worldsfirst",
            RaidToUrlPaths[raid],
            0
        ])

        if (prefetched?.incomplete) {
            return {
                props: {
                    raid,
                    dehydratedState: dehydrate(queryClient)
                },
                revalidate: 30
            }
        } else {
            // cache 2nd page
            await queryClient.prefetchQuery(
                ["worldsfirst", RaidToUrlPaths[raid], 1],
                () => getLeaderboard(paramsStrings, 1),
                {
                    staleTime
                }
            )

            return {
                props: {
                    raid,
                    dehydratedState: dehydrate(queryClient)
                },
                revalidate: staleTime / 1000 // revalidate takes seconds
            }
        }
    } catch (e) {
        console.error(e)
        return { notFound: true }
    }
}

const NoChallengeContestLeaderboadPage: NextPage<NoChallengeContestLeaderboadProps> = ({
    raid,
    dehydratedState
}) => {
    return (
        <Hydrate state={dehydratedState}>
            <NoChallengeContestLeaderboad raid={raid} />
        </Hydrate>
    )
}

const NoChallengeContestLeaderboad = ({ raid }: { raid: ListedRaid }) => {
    const { strings, locale } = useLocale()
    const [page, setPage] = usePage()
    const raidName = strings.raidNames[raid]
    const query = useQuery({
        queryKey: ["worldsfirst", RaidToUrlPaths[raid], page],
        queryFn: () => getLeaderboard(["worldsfirst", RaidToUrlPaths[raid], "normal"], page)
    })

    return (
        <>
            <Head>
                <title>{`${raidName} | No Challenge Contest Leaderboards`}</title>
            </Head>

            <Leaderboard
                title={"No Challenge Contest " + raidName}
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

export default NoChallengeContestLeaderboadPage
