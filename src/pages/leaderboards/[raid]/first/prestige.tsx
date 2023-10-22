import { GetStaticPaths, GetStaticProps } from "next"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { createServerSideQueryClient, prefetchLeaderboard } from "~/server/serverQueryClient"
import { zRaidURIComponent } from "~/util/zod"
import MickeyMouseLeaderboard from "~/components/leaderboards/MickyMouseLeaderboard"
import { UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { PrestigeRaid, PrestigeRaids } from "~/types/raids"
import { includedIn } from "~/util/betterIncludes"
import { PrestigeReleases } from "~/data/destiny-dates"

type PrestigeWFPageProps = {
    raid: PrestigeRaid
    dehydratedState: unknown
}

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return process.env.APP_ENV !== "local"
        ? {
              paths: Object.entries(UrlPathsToRaid)
                  .filter(([_, raid]) => includedIn(PrestigeRaids, raid))
                  .map(([path, _]) => ({
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

export const getStaticProps: GetStaticProps<PrestigeWFPageProps, { raid: string }> = async ({
    params
}) => {
    try {
        const raid = zRaidURIComponent.parse(params?.raid)
        if (!includedIn(PrestigeRaids, raid)) {
            throw Error("raid does not have a prestige version")
        }

        const queryClient = createServerSideQueryClient()
        await prefetchLeaderboard(
            {
                raid: raid,
                board: Leaderboard.WorldFirst,
                params: ["prestige"],
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

export default function LeaderboadPage({ raid, dehydratedState }: PrestigeWFPageProps) {
    return (
        <Hydrate state={dehydratedState}>
            <MickeyMouseLeaderboard
                raid={raid}
                params={["prestige"]}
                descriptor="Prestige"
                date={PrestigeReleases[raid]}
            />
        </Hydrate>
    )
}
