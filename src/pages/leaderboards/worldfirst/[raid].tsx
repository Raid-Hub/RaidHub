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
import { QueryClient, Hydrate, dehydrate } from "@tanstack/react-query"
import { getLeaderboard } from "../../../services/raidhub/getLeaderboard"

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
    const raidName = strings.raidNames[raid]
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
                    path={["worldsfirst", RaidToUrlPaths[raid], DifficultyToUrlPaths[difficulty]]}
                    raid={raid}
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
        await queryClient.prefetchQuery(
            ["leaderboards", fullPath, 0],
            () => getLeaderboard(fullPath, 0),
            { staleTime: Infinity }
        )

        // clear the static query if it's not marked as complete
        const prefetched = queryClient.getQueryData(["leaderboards", fullPath, 0]) as any
        if (prefetched.incomplete) {
            queryClient.clear()
        }

        return {
            props: {
                raid,
                difficulty,
                dehydratedState: dehydrate(queryClient)
            }
        }
    } catch (e) {
        console.error(e)
        return { notFound: true }
    }
}
