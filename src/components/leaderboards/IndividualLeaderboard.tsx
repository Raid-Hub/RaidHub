import styles from "~/styles/pages/leaderboards.module.css"
import {
    Leaderboard,
    getIndividualLeaderboard,
    leaderboardQueryKey
} from "~/services/raidhub/getLeaderboard"
import { ListedRaid } from "~/types/raids"
import { useLocale } from "../app/LocaleManager"
import { usePage } from "~/hooks/util/usePage"
import Head from "next/head"
import { useQuery } from "@tanstack/react-query"
import { Controls } from "./LeaderboardControls"
import Loading from "../global/Loading"
import { IndividualLeaderboardEntryComponent } from "./IndividualLeaderboardEntry"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import CloudflareImage from "~/images/CloudflareImage"
import RaidBanners from "~/images/raid-banners"
import { useRaidHubManifest } from "../app/RaidHubManifestManager"

const ENTRIES_PER_PAGE = 50

export type IndividualLeaderboadProps = {
    raid: ListedRaid
    board: Exclude<Leaderboard, Leaderboard.WorldFirst>
}

export const IndividualLeaderboad = ({ raid, board }: IndividualLeaderboadProps) => {
    const { strings } = useLocale()
    const { page, handleBackwards, handleForwards } = usePage()
    const raidName = strings.raidNames[raid]
    const boardName = strings.individualLeaderboads[board]
    const query = useQuery({
        queryKey: leaderboardQueryKey(raid, board, [], page),
        queryFn: () => getIndividualLeaderboard(raid, board, page)
    })
    const manifest = useRaidHubManifest()
    const title = `${raidName} | ${boardName} Leaderboards`
    const description = `${boardName} Leaderboards for ${raidName}`
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
            </Head>

            <main className={styles["main"]}>
                <section className={styles["individual-leaderboard-banner"]}>
                    <div>
                        <h1 className={styles["header-h1"]}>{boardName}</h1>
                        <h3 className={styles["header-h3"]}>{raidName}</h3>
                    </div>
                    <CloudflareImage
                        priority
                        cloudflareId={RaidBanners[raid]}
                        alt={raidName}
                        fill
                    />
                </section>
                <Controls
                    entriesLength={query.data?.length ?? 0}
                    entriesPerPage={ENTRIES_PER_PAGE}
                    isLoading={query.isLoading}
                    currentPage={page}
                    refresh={query.refetch}
                    handleBackwards={handleBackwards}
                    handleForwards={handleForwards}
                />
                <section className={styles["leaderboard-container"]}>
                    {query.isSuccess
                        ? query.data.map(e => (
                              <IndividualLeaderboardEntryComponent
                                  entry={{
                                      displayName: e.player.bungieGlobalDisplayName,
                                      iconURL: bungieIconUrl(e.player.iconPath),
                                      id: e.player.membershipId,
                                      rank: e.rank,
                                      url: `/profile/${e.player.membershipType}/${e.player.membershipId}`,
                                      value: e.value
                                  }}
                                  key={e.player.membershipId}
                              />
                          ))
                        : new Array(ENTRIES_PER_PAGE)
                              .fill(null)
                              .map((_, idx) => (
                                  <Loading
                                      key={idx}
                                      className={styles["leaderboard-entry-loading"]}
                                  />
                              ))}
                    {(query.data?.length ?? 0) > 20 && (
                        <Controls
                            entriesLength={query.data?.length ?? 0}
                            entriesPerPage={ENTRIES_PER_PAGE}
                            isLoading={query.isLoading}
                            currentPage={page}
                            refresh={query.refetch}
                            handleBackwards={handleBackwards}
                            handleForwards={handleForwards}
                        />
                    )}
                </section>
            </main>
        </>
    )
}
