import { Hydrate, QueryClient, dehydrate, useQuery } from "@tanstack/react-query"
import { getLeaderboard } from "../../../../services/speedrun-com/getLeaderboard"
import { AvailableRaid, UrlPathsToRaid } from "../../../../types/raids"
import Leaderboard, { ENTRIES_PER_PAGE } from "../../../../components/leaderboards/Leaderboard"
import { useMemo } from "react"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { z } from "zod"
import Head from "next/head"
import { useLocale } from "../../../../components/app/LocaleManager"
import { usePage } from "../../../../hooks/util/usePage"

type RTASpeedunLeaderboadProps = {
    raid: AvailableRaid
    dehydratedState: unknown
}

const RTASpeedunLeaderboad: NextPage<RTASpeedunLeaderboadProps> = ({ raid, dehydratedState }) => {
    const { strings } = useLocale()
    const [page, setPage] = usePage()
    const query = useQuery({
        queryKey: ["rta-leaderboards", raid],
        queryFn: () => getLeaderboard(raid)
    })

    const raidName = useMemo(() => strings.raidNames[raid], [strings, raid])

    return (
        <>
            <Head>
                <title>{`${raidName} | RTA Speedrun Leaderboards`}</title>
            </Head>
            <Hydrate state={dehydratedState}>
                <Leaderboard
                    title={raidName + " RTA Speedrun Leaderboards"}
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
                raid: path
            }
        })),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<RTASpeedunLeaderboadProps, { raid: string }> = async ({
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

        // we prefetch the first page at build time
        const staleTime = 60 * 60 * 1000 // 1 hour
        await queryClient.prefetchQuery(["rta-leaderboards", raid], () => getLeaderboard(raid), {
            staleTime
        })

        return {
            props: {
                raid,
                dehydratedState: dehydrate(queryClient)
            },
            revalidate: staleTime / 1000
        }
    } catch (e) {
        console.error(e)
        return { notFound: true }
    }
}
