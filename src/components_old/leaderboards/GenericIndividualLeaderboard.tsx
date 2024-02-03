import Head from "next/head"
import { useRouter } from "next/router"
import CloudflareImage from "~/images/CloudflareImage"
import styles from "~/styles/pages/leaderboards.module.css"
import { RaidHubIndividualLeaderboardEntry } from "~/types/raidhub-api"
import { LEADERBOARD_ENTRIES_PER_PAGE } from "~/util/constants"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import Loading from "../../components/Loading"
import { IndividualLeaderboardEntryComponent } from "./IndividualLeaderboardEntry"
import { Controls } from "./LeaderboardControls"

export default function GenericIndividualLeaderboard({
    title,
    description,
    subtitle,
    cloudflareBannerId,
    boardName,
    data,
    isRefetching,
    isLoading,
    isLoadingSearch,
    currentPage,
    refresh,
    handleBackwards,
    handleForwards,
    searchForLeaderboardPlayer
}: {
    title: string
    cloudflareBannerId: string
    description: string
    subtitle: string
    boardName: string
    data: readonly RaidHubIndividualLeaderboardEntry[] | undefined
    isRefetching: boolean
    isLoading: boolean
    isLoadingSearch: boolean
    currentPage: number
    refresh: () => void
    handleBackwards: () => void
    handleForwards: () => void
    searchForLeaderboardPlayer: (membershipId: string) => void
}) {
    const { query: queryParams } = useRouter()

    function PageControls({ includeSearch }: { includeSearch?: boolean }) {
        return (
            <Controls
                entriesLength={data?.length ?? 0}
                entriesPerPage={LEADERBOARD_ENTRIES_PER_PAGE}
                isLoading={isLoading}
                currentPage={currentPage}
                refresh={refresh}
                handleBackwards={handleBackwards}
                handleForwards={handleForwards}
                searchFn={includeSearch ? searchForLeaderboardPlayer : undefined}
            />
        )
    }
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
                        <h3 className={styles["header-h3"]}>{subtitle}</h3>
                    </div>
                    <CloudflareImage
                        priority
                        cloudflareId={cloudflareBannerId}
                        alt={subtitle}
                        fill
                    />
                </section>
                <PageControls includeSearch />
                <section className={styles["leaderboard-container"]}>
                    {isLoadingSearch ? (
                        <div>Searching...</div>
                    ) : isLoading || isRefetching ? (
                        new Array(LEADERBOARD_ENTRIES_PER_PAGE)
                            .fill(null)
                            .map((_, idx) => (
                                <Loading
                                    key={idx}
                                    className={styles["leaderboard-entry-loading"]}
                                />
                            ))
                    ) : (
                        data?.map(e => (
                            <IndividualLeaderboardEntryComponent
                                entry={{
                                    displayName:
                                        e.player.bungieGlobalDisplayName ||
                                        e.player.displayName ||
                                        e.player.membershipId,
                                    iconURL: bungieIconUrl(e.player.iconPath),
                                    id: e.player.membershipId,
                                    rank: e.rank,
                                    url: `/profile/${e.player.membershipType}/${e.player.membershipId}`,
                                    value: e.value
                                }}
                                key={e.player.membershipId}
                                isSearched={queryParams["player"] === e.player.membershipId}
                                valueType="number"
                            />
                        ))
                    )}
                </section>
                {!isLoadingSearch && (data?.length ?? 0) > 20 && <PageControls />}
            </main>
        </>
    )
}
