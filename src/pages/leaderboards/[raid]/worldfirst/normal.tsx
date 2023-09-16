import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { Hydrate, useQuery } from "@tanstack/react-query"
import LeaderboardComponent from "~/components/leaderboards/Leaderboard"
import { useLocale } from "~/components/app/LocaleManager"
import { ReleaseDate, UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { toCustomDateString } from "~/util/presentation/formatting"
import { Leaderboard, getLeaderboard, leaderbordQueryKey } from "~/services/raidhub/getLeaderboard"
import { usePage } from "~/hooks/util/usePage"
import { ListedRaid, RaidsWithReprisedContest, ReprisedRaid } from "~/types/raids"
import { prefetchLeaderboard } from "~/server/serverQueryClient"
import { zRaidURIComponent } from "~/util/zod"
import WorldFirstHeader from "~/components/leaderboards/WorldFirstHeader"

type NoChallengeContestLeaderboadProps = {
    raid: ListedRaid
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

export const getStaticProps: GetStaticProps<
    NoChallengeContestLeaderboadProps,
    { raid: string }
> = async ({ params }) => {
    try {
        const { raid } = zRaidURIComponent.parse(params)
        if (!RaidsWithReprisedContest.includes(raid as ReprisedRaid)) {
            throw Error("raid does not have a reprised version")
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

export default function NoChallengeContestLeaderboadPage({
    raid,
    dehydratedState
}: NoChallengeContestLeaderboadProps) {
    return (
        <Hydrate state={dehydratedState}>
            <NoChallengeContestLeaderboad raid={raid} />
        </Hydrate>
    )
}

const NoChallengeContestLeaderboad = ({ raid }: { raid: ListedRaid }) => {
    const { strings, locale } = useLocale()
    const [page, setPage] = usePage()
    const raidName = strings.raidNames[raid]
    const params = ["normal"]
    const query = useQuery({
        queryKey: leaderbordQueryKey(raid, Leaderboard.WorldFirst, params, page),
        queryFn: () => getLeaderboard(raid, Leaderboard.WorldFirst, params, page)
    })

    const title = `${raidName} | Normal Contest Leaderboards`
    const raidDate = toCustomDateString(ReleaseDate[raid], locale)
    const description = `Contest (Normal) Leaderboards for ${raidName} on ${raidDate}`
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
                <meta name="date" content={ReleaseDate[raid].toISOString().slice(0, 10)} />
            </Head>

            <LeaderboardComponent
                entries={query.data?.entries ?? []}
                isLoading={query.isLoading}
                page={page}
                setPage={setPage}>
                <WorldFirstHeader
                    title={"Normal Contest " + raidName}
                    subtitle={toCustomDateString(ReleaseDate[raid], locale)}
                    raid={raid}
                />
            </LeaderboardComponent>
        </>
    )
}
