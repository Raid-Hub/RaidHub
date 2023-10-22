import { ListedRaid } from "~/types/raids"
import { useLocale } from "../app/LocaleManager"
import { usePage } from "~/hooks/util/usePage"
import { useQuery } from "@tanstack/react-query"
import { Leaderboard, getLeaderboard, leaderboardQueryKey } from "~/services/raidhub/getLeaderboard"
import { toCustomDateString } from "~/util/presentation/formatting"
import Head from "next/head"
import LeaderboardComponent from "./Leaderboard"
import WorldFirstHeader from "./WorldFirstHeader"

export default function MickeyMouseLeaderboard({
    raid,
    params,
    descriptor,
    date
}: {
    raid: ListedRaid
    params: string[]
    descriptor: string
    date: Date
}) {
    const { strings, locale } = useLocale()
    const [page, setPage] = usePage()
    const raidName = strings.raidNames[raid]
    const query = useQuery({
        queryKey: leaderboardQueryKey(raid, Leaderboard.WorldFirst, params, page),
        queryFn: () => getLeaderboard(raid, Leaderboard.WorldFirst, params, page)
    })

    const title = `${raidName} | ${descriptor} Leaderboards`
    const raidDate = toCustomDateString(date, locale)
    const description = `${descriptor} Leaderboards for ${raidName} on ${raidDate}`
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
                <meta name="date" content={date.toISOString().slice(0, 10)} />
            </Head>

            <LeaderboardComponent
                entries={query.data?.entries ?? []}
                isLoading={query.isLoading || query.isRefetching}
                page={page}
                setPage={setPage}
                refresh={query.refetch}>
                <WorldFirstHeader
                    title={descriptor + " " + raidName}
                    subtitle={toCustomDateString(date, locale)}
                    raid={raid}
                />
            </LeaderboardComponent>
        </>
    )
}
