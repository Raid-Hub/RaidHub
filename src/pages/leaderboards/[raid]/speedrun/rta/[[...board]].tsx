import Head from "next/head"
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps, NextPage } from "next"
import { Hydrate, useQuery } from "@tanstack/react-query"
import { z } from "zod"
import { ListedRaid } from "~/types/raids"
import Leaderboard, { ENTRIES_PER_PAGE } from "~/components/leaderboards/Leaderboard"
import { useLocale } from "~/components/app/LocaleManager"
import { usePage } from "~/hooks/util/usePage"
import { UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { SpeedData, SpeedrunVariables } from "~/data/speedrun-com-mappings"
import {
    SpeedrunQueryArgs,
    getSpeedrunComLeaderboard,
    rtaQueryKey
} from "~/services/speedrun-com/getSpeedrunComLeaderboard"
import { zRaidURIComponent } from "~/util/zod"
import { prefetchSpeedrunComLeaderboard } from "~/server/serverQueryClient"

type RTASpeedunLeaderboadProps<
    K extends (typeof SpeedrunVariables)[R] extends { values: infer D }
        ? keyof D
        : (typeof SpeedrunVariables)[R] extends null
        ? never
        : string,
    R extends ListedRaid = ListedRaid
> = SpeedrunQueryArgs<R, K> & {
    dehydratedState: unknown
}

const categoryPaths = (
    vars: NonNullable<(typeof SpeedrunVariables)[ListedRaid]>,
    basePath: string
) =>
    Object.keys(vars.values).map(path => ({
        params: {
            raid: basePath,
            board: [encodeURIComponent(path)]
        }
    }))

export const getStaticPaths: GetStaticPaths<{ raid: string; board: string[] }> = async () => {
    return process.env.APP_ENV === "local"
        ? {
              paths: [],
              fallback: "blocking"
          }
        : {
              paths: Object.entries(UrlPathsToRaid)
                  .map(([basePath, raidEnum]) => {
                      const base = {
                          params: {
                              raid: basePath,
                              board: new Array<string>()
                          }
                      }

                      const vars = SpeedrunVariables[raidEnum]
                      if (vars) {
                          return [base, categoryPaths(vars, basePath)]
                      } else {
                          return base
                      }
                  })
                  .flat(2) satisfies GetStaticPathsResult["paths"],
              fallback: false
          }
}

export const getStaticProps: GetStaticProps<
    RTASpeedunLeaderboadProps<string, ListedRaid>,
    { raid: string; board: string[] }
> = async ({ params }) => {
    try {
        const { raid, board: paths } = z
            .object({
                board: z.array(z.string()).optional()
            })
            .merge(zRaidURIComponent)
            .parse(params)

        const dict = SpeedrunVariables[raid]?.values
        if (paths && dict) {
            if (!Object.keys(dict).includes(paths[0])) throw Error("Key not found for board")
        }

        const category = paths ? paths[0] : null

        const { staleTime, dehydratedState } = await prefetchSpeedrunComLeaderboard(raid, category)

        return {
            props: {
                raid,
                category,
                dehydratedState
            },
            revalidate: staleTime / 1000
        }
    } catch (e) {
        console.error(e)
        return { notFound: true }
    }
}

const RTASpeedunLeaderboad: NextPage<RTASpeedunLeaderboadProps<string>> = ({
    raid,
    category,
    dehydratedState
}) => {
    const { strings } = useLocale()
    const [page, setPage] = usePage()
    const query = useQuery({
        queryKey: rtaQueryKey(raid, category),
        queryFn: () => getSpeedrunComLeaderboard({ raid, category })
    })

    const raidName = strings.raidNames[raid]
    const vars = SpeedrunVariables[raid]
    const subKey =
        category && vars
            ? // @ts-ignore
              (SpeedrunVariables[raid]?.values[category] as SpeedData).name
            : undefined
    const subtitle = subKey ? strings.leaderboards[subKey] : undefined

    return (
        <>
            <Head>
                <title>{`${raidName} | RTA Speedrun Leaderboards`}</title>
            </Head>
            <Hydrate state={dehydratedState}>
                <Leaderboard
                    title={raidName + " RTA"}
                    subtitle={subtitle}
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
