import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Leaderboard from "../../../../components/leaderboards/Leaderboard"
import Head from "next/head"
import {
    AvailableRaid,
    Difficulty,
    DifficultyToUrlPaths,
    NoContestRaid,
    NoContestRaids,
    RaidHashes,
    RaidToUrlPaths,
    ReprisedContestDifficultyDictionary,
    ReprisedContestRaidDifficulties,
    ReprisedRaid,
    UrlPathsToDifficulty,
    UrlPathsToRaid
} from "../../../../types/raids"
import { ReleaseDate } from "../../../../util/destiny/raid"
import { useLocale } from "../../../../components/app/LocaleManager"
import { toCustomDateString } from "../../../../util/presentation/formatting"
import { z } from "zod"
import { QueryClient, Hydrate, dehydrate, useQuery } from "@tanstack/react-query"
import { getLeaderboard } from "../../../../services/raidhub/getLeaderboard"
import { usePage } from "../../../../hooks/util/usePage"

type WorldsFirstLeaderboadProps = {
    raid: AvailableRaid
    difficulty: keyof typeof DifficultyToUrlPaths
    dehydratedState: unknown
}

export const getStaticPaths: GetStaticPaths<{ raid: string; difficulty: string }> = async () => {
    return {
        paths: Object.entries(UrlPathsToRaid)
            .map(([path, raidValue]) =>
                (
                    Object.keys(RaidHashes[raidValue])
                        .map(key => Number(key) as Difficulty)
                        .filter(
                            difficulty =>
                                difficulty !== Difficulty.GUIDEDGAMES &&
                                difficulty !== Difficulty.CONTEST &&
                                difficulty !== Difficulty.NA
                        ) as Exclude<
                        Difficulty,
                        Difficulty.GUIDEDGAMES | Difficulty.NA | Difficulty.CONTEST
                    >[]
                ).map(difficulty => {
                    return {
                        params: {
                            raid: path,
                            difficulty: DifficultyToUrlPaths[difficulty]
                        }
                    }
                })
            )
            .flat(),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<
    WorldsFirstLeaderboadProps,
    { raid: string; difficulty: string }
> = async ({ params }) => {
    try {
        const { raid: path, difficulty: difficultyPath } = z
            .object({
                raid: z.string().refine(key => key in UrlPathsToRaid),
                difficulty: z.string().refine(key => key in UrlPathsToDifficulty)
            })
            .parse(params) as {
            raid: keyof typeof UrlPathsToRaid
            difficulty: keyof typeof UrlPathsToDifficulty
        }
        const difficulty = UrlPathsToDifficulty[difficultyPath]
        const raid = UrlPathsToRaid[path]

        const queryClient = new QueryClient()

        // we prefetch the first page at build time
        const fullPath = ["worldsfirst", path, difficultyPath]
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
                    subtitle={
                        difficulty === Difficulty.NORMAL ||
                        (ReprisedContestRaidDifficulties as readonly Difficulty[]).includes(
                            difficulty
                        )
                            ? toCustomDateString(ReleaseDate[raid], locale)
                            : strings.difficulty[difficulty]
                    }
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
