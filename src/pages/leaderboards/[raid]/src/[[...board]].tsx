import Head from "next/head"
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from "next"
import { Hydrate, useQuery } from "@tanstack/react-query"
import { z } from "zod"
import { ListedRaid } from "~/types/raids"
import Leaderboard, { ENTRIES_PER_PAGE } from "~/components/leaderboards/Leaderboard"
import { useLocale } from "~/components/app/LocaleManager"
import { usePage } from "~/hooks/util/usePage"
import { UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { SpeedData, SpeedrunBoardId, SpeedrunVariables } from "~/data/speedrun-com-mappings"
import {
    SpeedrunQueryArgs,
    getSpeedrunComLeaderboard,
    rtaQueryKey
} from "~/services/speedrun-com/getSpeedrunComLeaderboard"
import { zRaidURIComponent } from "~/util/zod"
import { prefetchSpeedrunComLeaderboard } from "~/server/serverQueryClient"
import SpeedrunComBanner from "~/components/leaderboards/SpeedrunComBanner"

type RTASpeedunLeaderboadProps<
    K extends (typeof SpeedrunVariables)[R] extends { values: infer D }
        ? keyof D
        : (typeof SpeedrunVariables)[R] extends null
        ? never
        : string,
    R extends ListedRaid = ListedRaid
> = SpeedrunQueryArgs<R, K>

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
            .merge(z.object({ raid: zRaidURIComponent }))
            .parse(params)

        const dict = SpeedrunVariables[raid]?.values
        if (paths && dict) {
            if (!Object.keys(dict).includes(paths[0])) throw Error("Key not found for board")
        }

        const category = paths ? paths[0] : null

        const dehydratedState = await prefetchSpeedrunComLeaderboard(raid, category)

        return {
            props: {
                raid,
                category,
                dehydratedState
            },
            revalidate: 3600 // 1 hour
        }
    } catch (e) {
        console.error(e)
        return { notFound: true }
    }
}

export default function RtaLeaderboardPage({
    dehydratedState,
    ...props
}: RTASpeedunLeaderboadProps<string> & { dehydratedState: unknown }) {
    return (
        <Hydrate state={dehydratedState}>
            <RTASpeedunLeaderboad {...props} />
        </Hydrate>
    )
}

const RTASpeedunLeaderboad = ({ raid, category }: RTASpeedunLeaderboadProps<string>) => {
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
              (SpeedrunVariables[raid]?.values[category] as SpeedData)
            : undefined
    const subtitle = subKey ? strings.leaderboards[subKey.name] : undefined

    const pageTitle = `${raidName} | RTA Speedrun Leaderboards`
    const description = `RTA Speedrun Leaderboards for ${raidName}`
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={pageTitle} />
                <meta key="og-descriptions" property="og:description" content={description} />
            </Head>
            <Leaderboard
                entries={(query.data ?? []).slice(
                    ENTRIES_PER_PAGE * page,
                    ENTRIES_PER_PAGE * (page + 1)
                )}
                isLoading={query.isLoading}
                page={page}
                setPage={setPage}>
                <SpeedrunComBanner
                    title={raidName}
                    subtitle={subtitle}
                    raid={raid}
                    raidId={SpeedrunBoardId[raid]!}
                    category={
                        subKey && category
                            ? {
                                  variable: category,
                                  value: subKey.id
                              }
                            : undefined
                    }
                    others={
                        SpeedrunVariables[raid]?.values
                            ? (SpeedrunVariables[raid]!.values as Record<string, SpeedData>)
                            : undefined
                    }
                />
            </Leaderboard>
        </>
    )
}
