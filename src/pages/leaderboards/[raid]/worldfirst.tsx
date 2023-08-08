import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Leaderboard from "../../../components/leaderboards/Leaderboard"
import Head from "next/head"
import {
    AvailableRaid,
    Difficulty,
    DifficultyToUrlPaths,
    NoContestRaid,
    NoContestRaids,
    RaidToUrlPaths,
    ReprisedContestDifficultyDictionary,
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

type WorldsFirstLeaderboadProps = {
    raid: AvailableRaid
    difficulty: keyof typeof DifficultyToUrlPaths
    dehydratedState: unknown
}

const WorldsFirstLeaderboad: NextPage<WorldsFirstLeaderboadProps> = ({
    raid,
    difficulty,
    dehydratedState
}) => {
    const { strings, locale } = useLocale()
    const [page, setPage] = usePage()
    const raidName = strings.raidNames[raid]
    const fullPath = ["worldsfirst", RaidToUrlPaths[raid], DifficultyToUrlPaths[difficulty]]
    const query = useQuery({
        queryKey: [fullPath, page],
        queryFn: () => getLeaderboard(fullPath, page)
    })
    return (
        <>
            <Head>
                <title>{`${raidName} | World First Leaderboards`}</title>
            </Head>

            {/* It's important to hydrate the first page of the leaderboards to improve SEO */}
            <Hydrate state={dehydratedState}>
                <Leaderboard
                    title={"World First " + raidName}
                    subtitle={toCustomDateString(ReleaseDate[raid], locale)}
                    raid={raid}
                    entries={query.data ?? []}
                    isLoading={query.isLoading}
                    type={"API"}
                    page={page}
                    setPage={setPage}
                />
            </Hydrate>
        </>
    )
}

export default WorldsFirstLeaderboad

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return {
        paths: Object.keys(UrlPathsToRaid).map(path => ({
            params: {
                raid: path
            }
        })),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<WorldsFirstLeaderboadProps, { raid: string }> = async ({
    params
}) => {
    try {
        const { raid: path } = z
            .object({
                raid: z.string().refine(key => key in UrlPathsToRaid)
            })
            .parse(params) as { raid: keyof typeof UrlPathsToRaid }
        const raid = UrlPathsToRaid[path]

        const queryClient = new QueryClient()

        const difficulty =
            ReprisedContestDifficultyDictionary[raid as ReprisedRaid] ??
            (NoContestRaids.includes(raid as NoContestRaid)
                ? Difficulty.NORMAL
                : Difficulty.CONTEST)

        // we prefetch the first page at build time
        const fullPath = ["worldsfirst", path, DifficultyToUrlPaths[difficulty]]
        const staleTime = 24 * 60 * 60 * 1000 // 24 hours
        await queryClient.prefetchQuery([fullPath, 0], () => getLeaderboard(fullPath, 0), {
            staleTime
        })

        // clear the static query if it's not marked as complete
        const prefetched = queryClient.getQueryData([fullPath, 0]) as any

        if (prefetched.incomplete) {
            return {
                props: {
                    raid,
                    difficulty,
                    dehydratedState: dehydrate(queryClient)
                },
                revalidate: 30
            }
        } else {
            // cache 2nd page
            await queryClient.prefetchQuery([fullPath, 1], () => getLeaderboard(fullPath, 1), {
                staleTime
            })

            return {
                props: {
                    raid,
                    difficulty,
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
