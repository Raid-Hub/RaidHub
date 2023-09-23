import { GetStaticPaths, GetStaticProps } from "next"
import { Hydrate } from "@tanstack/react-query"
import { UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { RaidsWithReprisedContest, ReprisedRaid } from "~/types/raids"
import { prefetchLeaderboard } from "~/server/serverQueryClient"
import { zRaidURIComponent } from "~/util/zod"
import MickeyMouseLeaderboard from "~/components/leaderboards/MickyMouseLeaderboard"
import { includedIn } from "~/util/betterIncludes"

type NormalWFPageProps = {
    raid: ReprisedRaid
    dehydratedState: unknown
}

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return process.env.APP_ENV !== "local"
        ? {
              paths: Object.entries(UrlPathsToRaid)
                  .filter(([_, raid]) => RaidsWithReprisedContest.includes(raid as ReprisedRaid))
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

export const getStaticProps: GetStaticProps<NormalWFPageProps, { raid: string }> = async ({
    params
}) => {
    try {
        const { raid } = zRaidURIComponent.parse(params)
        if (!includedIn(RaidsWithReprisedContest, raid)) {
            throw Error("raid does not have a reprised challenge version")
        }

        const { staleTime, dehydratedState } = await prefetchLeaderboard(
            raid,
            Leaderboard.WorldFirst,
            ["normal"],
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

export default function NormalWFPage({ raid, dehydratedState }: NormalWFPageProps) {
    return (
        <Hydrate state={dehydratedState}>
            <MickeyMouseLeaderboard
                raid={raid}
                params={["normal"]}
                descriptor="Normal Contest"
                date={new Date()}
            />
        </Hydrate>
    )
}
