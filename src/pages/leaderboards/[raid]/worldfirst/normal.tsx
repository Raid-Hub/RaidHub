import { GetStaticPaths, GetStaticProps, NextPage } from "next"
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

const NoChallengeContestLeaderboadPage: NextPage<NoChallengeContestLeaderboadProps> = ({
    raid,
    dehydratedState
}) => {
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

    return (
        <>
            <Head>
                <title>{`${raidName} | Normal Contest Leaderboards`}</title>
            </Head>

            <LeaderboardComponent
                title={"Normal Contest " + raidName}
                subtitle={toCustomDateString(ReleaseDate[raid], locale)}
                raid={raid}
                entries={query.data?.entries ?? []}
                isLoading={query.isLoading}
                type={"API"}
                page={page}
                setPage={setPage}
            />
        </>
    )
}

export default NoChallengeContestLeaderboadPage
