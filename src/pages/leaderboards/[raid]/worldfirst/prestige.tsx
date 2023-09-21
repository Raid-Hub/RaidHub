import { GetStaticPaths, GetStaticProps } from "next"
import { Hydrate } from "@tanstack/react-query"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { prefetchLeaderboard } from "~/server/serverQueryClient"
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
                  .filter(([_, raid]) => PrestigeRaids.includes(raid as PrestigeRaid))
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
        const { raid } = zRaidURIComponent.parse(params)
        if (!includedIn(PrestigeRaids, raid)) {
            throw Error("raid does not have a prestige version")
        }

        const { staleTime, dehydratedState } = await prefetchLeaderboard(
            raid,
            Leaderboard.WorldFirst,
            ["prestige"],
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
