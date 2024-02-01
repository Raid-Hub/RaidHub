import { Hydrate, dehydrate } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import MickeyMouseLeaderboard from "~/components/leaderboards/MickyMouseLeaderboard"
import { createServerSideQueryClient, prefetchLeaderboard } from "~/server/serverQueryClient"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { Raid } from "~/types/raidhub-api"
import { RaidToUrlPaths } from "~/util/destiny/raidUtils"
import { zRaidURIComponent } from "~/util/zod"

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => ({
    paths: [
        {
            params: {
                raid: RaidToUrlPaths[Raid.LEVIATHAN]
            }
        }
    ],
    fallback: "blocking"
})

export const getStaticProps: GetStaticProps<
    { dehydratedState: unknown },
    { raid: string }
> = async ({ params }) => {
    try {
        const raid = zRaidURIComponent.parse(params?.raid)
        if (raid !== Raid.LEVIATHAN) {
            throw Error("raid released on pc and console at the same time")
        }

        const queryClient = createServerSideQueryClient()
        await prefetchLeaderboard(
            {
                raid: raid,
                board: Leaderboard.WorldFirst,
                params: ["pc"],
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

export default function LeaderboadPage({ dehydratedState }: { dehydratedState: unknown }) {
    return (
        <Hydrate state={dehydratedState}>
            <MickeyMouseLeaderboard raid={Raid.LEVIATHAN} params={["pc"]} descriptor="PC" />
        </Hydrate>
    )
}
