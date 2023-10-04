import { GetStaticPaths, GetStaticProps } from "next"
import { Hydrate } from "@tanstack/react-query"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { MasterRaid, MasterRaids } from "~/types/raids"
import { prefetchLeaderboard } from "~/server/serverQueryClient"
import { zRaidURIComponent } from "~/util/zod"
import MickeyMouseLeaderboard from "~/components/leaderboards/MickyMouseLeaderboard"
import { UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { MasterReleases } from "~/data/destiny-dates"
import { includedIn } from "~/util/betterIncludes"

type MasterWFPageProps = {
    raid: MasterRaid
    dehydratedState: unknown
}

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return process.env.APP_ENV !== "local"
        ? {
              paths: Object.entries(UrlPathsToRaid)
                  .filter(([_, raid]) => includedIn(MasterRaids, raid))
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

export const getStaticProps: GetStaticProps<MasterWFPageProps, { raid: string }> = async ({
    params
}) => {
    try {
        const raid = zRaidURIComponent.parse(params?.raid)
        if (!includedIn(MasterRaids, raid)) {
            throw Error("raid does not have a master version")
        }

        const { staleTime, dehydratedState } = await prefetchLeaderboard(
            raid,
            Leaderboard.WorldFirst,
            ["master"],
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

export default function LeaderboadPage({ raid, dehydratedState }: MasterWFPageProps) {
    return (
        <Hydrate state={dehydratedState}>
            <MickeyMouseLeaderboard
                raid={raid}
                params={["master"]}
                descriptor="Master"
                date={MasterReleases[raid]}
            />
        </Hydrate>
    )
}
