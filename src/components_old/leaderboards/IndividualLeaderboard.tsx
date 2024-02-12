import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import RaidBanners from "~/data/raid-banners"
import { usePage } from "~/hooks/util/usePage"
import { getIndividualLeaderboard, leaderboardQueryKey } from "~/services/raidhub/getLeaderboard"
import {
    searchLeaderboardPlayer,
    searchLeaderboardPlayerMutationKey
} from "~/services/raidhub/searchLeaderboard"
import { ListedRaid, RaidHubIndividualLeaderboardCategory } from "~/types/raidhub-api"
import { LEADERBOARD_ENTRIES_PER_PAGE } from "~/util/constants"
import { useRaidHubManifest } from "../../app/(layout)/managers/RaidHubManifestManager"
import GenericIndividualLeaderboard from "./GenericIndividualLeaderboard"

export const IndividualLeaderboad = ({
    raid,
    board
}: {
    raid: ListedRaid
    board: RaidHubIndividualLeaderboardCategory
}) => {
    const { getUrlPathForRaid, leaderboards, getRaidString } = useRaidHubManifest()
    const { page, handleBackwards, handleForwards, setPage } = usePage(["player"])
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: leaderboardQueryKey(raid, board, {
            page,
            count: LEADERBOARD_ENTRIES_PER_PAGE
        }),
        queryFn: () =>
            getIndividualLeaderboard({
                board: board,
                raid: getUrlPathForRaid(raid),
                count: LEADERBOARD_ENTRIES_PER_PAGE,
                page: page
            })
    })

    const searchParams = {
        type: "individual",
        raid,
        category: board,
        page,
        count: LEADERBOARD_ENTRIES_PER_PAGE
    } as const

    const { mutate: searchForLeaderboardPlayer, isLoading: isLoadingSearch } = useMutation({
        mutationKey: searchLeaderboardPlayerMutationKey(searchParams),
        mutationFn: (membershipId: string) => searchLeaderboardPlayer(searchParams, membershipId),
        onSuccess(result) {
            queryClient.setQueryData(
                leaderboardQueryKey(raid, board, {
                    count: LEADERBOARD_ENTRIES_PER_PAGE,
                    page: page
                }),
                result.entries
            )
            setPage(result.page)
        }
    })

    const raidName = getRaidString(raid)
    const boardName = leaderboards.individual[raid].find(b => b.category === board)?.name ?? board
    const title = `${raidName} | ${boardName} Leaderboards`
    const description = `${boardName} Leaderboards for ${raidName}`

    return (
        <GenericIndividualLeaderboard
            title={title}
            description={description}
            cloudflareBannerId={RaidBanners[raid]}
            subtitle={raidName}
            boardName={boardName}
            data={query.data}
            isRefetching={query.isFetching}
            isLoading={query.isLoading}
            isLoadingSearch={isLoadingSearch}
            currentPage={page}
            refresh={query.refetch}
            handleBackwards={handleBackwards}
            handleForwards={handleForwards}
            searchForLeaderboardPlayer={searchForLeaderboardPlayer}
        />
    )
}
