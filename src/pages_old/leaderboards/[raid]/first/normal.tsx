import { Hydrate, dehydrate } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import MickeyMouseLeaderboard from "~/components/leaderboards/MickyMouseLeaderboard"
import { createServerSideQueryClient, prefetchLeaderboard } from "~/server/serverQueryClient"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { RaidsWithReprisedContest, ReprisedRaid } from "~/types/raidhub-api"
import { UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { includedIn } from "~/util/helpers"
import { zRaidURIComponent } from "~/util/zod"

type NormalWFPageProps = {
    raid: ReprisedRaid
    dehydratedState: unknown
}

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return process.env.APP_ENV !== "local"
        ? {
              paths: Object.entries(UrlPathsToRaid)
                  .filter(([_, raid]) => includedIn(RaidsWithReprisedContest, raid))
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
        const raid = zRaidURIComponent.parse(params?.raid)
        if (!includedIn(RaidsWithReprisedContest, raid)) {
            throw Error("raid does not have a reprised challenge version")
        }

        const queryClient = createServerSideQueryClient()
        await prefetchLeaderboard(
            {
                raid: raid,
                board: Leaderboard.WorldFirst,
                params: ["normal"],
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

export default function NormalWFPage({ raid, dehydratedState }: NormalWFPageProps) {
    return (
        <Hydrate state={dehydratedState}>
            <MickeyMouseLeaderboard raid={raid} params={["normal"]} descriptor="Normal Contest" />
        </Hydrate>
    )
}
