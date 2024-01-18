import { dehydrate } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import { IndividualLeaderboadProps } from "~/components/leaderboards/IndividualLeaderboard"
import {
    createServerSideQueryClient,
    prefetchIndividualLeaderboard
} from "~/server/serverQueryClient"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { ListedRaid } from "~/types/raids"
import { includedIn } from "~/util/betterIncludes"
import { UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { zRaidURIComponent } from "~/util/zod"

export const createGetStaticPaths =
    (raids: readonly ListedRaid[]): GetStaticPaths<{ raid: string }> =>
    () => {
        return process.env.APP_ENV === "local"
            ? {
                  paths: [],
                  fallback: "blocking"
              }
            : {
                  paths: Object.entries(UrlPathsToRaid)
                      .filter(([_, raid]) => includedIn(raids, raid))
                      .map(([path]) => ({
                          params: {
                              raid: path
                          }
                      })),
                  fallback: false
              }
    }

export const createGetStaticProps =
    (
        leaderboard: Exclude<Leaderboard, Leaderboard.WorldFirst>
    ): GetStaticProps<
        IndividualLeaderboadProps & {
            dehydratedState: unknown
        },
        { raid: string }
    > =>
    async ({ params }) => {
        try {
            const raid = zRaidURIComponent.parse(params?.raid)

            const queryClient = createServerSideQueryClient()
            await prefetchIndividualLeaderboard(
                {
                    raid: raid,
                    board: leaderboard,
                    pages: 1
                },
                queryClient
            )

            return {
                props: {
                    raid,
                    board: leaderboard,
                    dehydratedState: dehydrate(queryClient)
                },
                revalidate: 3600 * 24 // 24 hours
            }
        } catch (e) {
            console.error(e)
            return { notFound: true }
        }
    }

export const createGlobalGetStaticProps =
    (
        leaderboard: Leaderboard.Sherpa | Leaderboard.Clears | Leaderboard.FullClears
    ): GetStaticProps<{
        dehydratedState: unknown
    }> =>
    async () => {
        try {
            const queryClient = createServerSideQueryClient()
            await prefetchIndividualLeaderboard(
                {
                    raid: "global",
                    board: leaderboard,
                    pages: 1
                },
                queryClient
            )

            return {
                props: {
                    dehydratedState: dehydrate(queryClient)
                },
                revalidate: 3600 * 24 // 24 hours
            }
        } catch (e) {
            console.error(e)
            return { notFound: true }
        }
    }
