import { Hydrate, QueryClient, dehydrate, useQuery } from "@tanstack/react-query"
import { getLeaderboard } from "../../../../../services/speedrun-com/getLeaderboard"
import { AvailableRaid, UrlPathsToRaid } from "../../../../../types/raids"
import Leaderboard, { ENTRIES_PER_PAGE } from "../../../../../components/leaderboards/Leaderboard"
import { useMemo } from "react"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { z } from "zod"
import Head from "next/head"
import { useLocale } from "../../../../../components/app/LocaleManager"
import { usePage } from "../../../../../hooks/util/usePage"
import {
    SpeedrunVariableIds,
    SpeedrunVariableValues
} from "../../../../../util/speedrun-com/speedrun-ids"
import { LocalStrings } from "../../../../../util/presentation/localized-strings"

type RTASpeedunLeaderboadProps = {
    raid: AvailableRaid
    category?: { path: string; key: keyof LocalStrings["leaderboards"] }
    dehydratedState: unknown
}

const RTASpeedunLeaderboad: NextPage<RTASpeedunLeaderboadProps> = ({
    raid,
    category,
    dehydratedState
}) => {
    const { strings } = useLocale()
    const [page, setPage] = usePage()
    const query = useQuery({
        queryKey: ["rta-leaderboards", raid, category?.path],
        queryFn: () => getLeaderboard(raid, category?.path)
    })

    const raidName = useMemo(() => strings.raidNames[raid], [strings, raid])

    return (
        <>
            <Head>
                <title>{`${raidName} | RTA Speedrun Leaderboards`}</title>
            </Head>
            <Hydrate state={dehydratedState}>
                <Leaderboard
                    title={raidName + " RTA"}
                    subtitle={category?.key ? strings.leaderboards[category.key] : undefined}
                    raid={raid}
                    entries={(query.data ?? []).slice(
                        ENTRIES_PER_PAGE * page,
                        ENTRIES_PER_PAGE * (page + 1)
                    )}
                    isLoading={query.isLoading}
                    type="RTA"
                    page={page}
                    setPage={setPage}
                />
            </Hydrate>
        </>
    )
}

export default RTASpeedunLeaderboad

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return {
        paths: Object.keys(UrlPathsToRaid).map(path => ({
            params: {
                raid: path,
                board: null // todo statically generate some of the non standard leaderboards
            }
        })),
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps<
    RTASpeedunLeaderboadProps,
    { raid: string; board: string[] }
> = async ({ params }) => {
    try {
        const { raid: path, board } = z
            .object({
                raid: z.string().refine(key => key in UrlPathsToRaid),
                board: z
                    .array(
                        z.string().refine(category =>
                            Object.values(SpeedrunVariableValues)
                                .map(arr => Object.keys(arr))
                                .flat()
                                .includes(category)
                        )
                    )
                    .optional()
            })
            .parse(params) as { raid: keyof typeof UrlPathsToRaid; board?: string[] }
        const raid = UrlPathsToRaid[path]

        const queryClient = new QueryClient()

        // we prefetch the first page at build time
        const staleTime = 60 * 60 * 1000 // 1 hour

        const category = SpeedrunVariableIds[raid]
            ? {
                  path: board?.[0] ?? "standard",
                  key: SpeedrunVariableValues[raid][board?.[0] ?? "standard"].name
              }
            : undefined
        await queryClient.prefetchQuery(
            ["rta-leaderboards", raid, category?.path],
            () => getLeaderboard(raid, category?.path),
            {
                staleTime
            }
        )

        return {
            props: {
                raid,
                category,
                dehydratedState: dehydrate(queryClient)
            },
            revalidate: staleTime / 1000
        }
    } catch (e) {
        console.error(e)
        return { notFound: true }
    }
}
