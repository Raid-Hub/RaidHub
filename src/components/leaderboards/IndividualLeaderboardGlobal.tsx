import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePage } from "~/hooks/util/usePage"
import {
    getIndividualGlobalLeaderboard,
    leaderboardQueryKey
} from "~/services/raidhub/getLeaderboard"
import {
    searchLeaderboardPlayer,
    searchLeaderboardPlayerMutationKey
} from "~/services/raidhub/searchLeaderboard"
import { RaidHubGlobalLeaderboardCategory } from "~/types/raidhub-api"
import { LEADERBOARD_ENTRIES_PER_PAGE } from "~/util/constants"
import GenericIndividualLeaderboard from "./GenericIndividualLeaderboard"

const GlobalLeaderboards = {
    fresh: "Total Full Clears",
    clears: "Total Clears",
    sherpas: "Total Sherpas",
    speed: "Sum of Fastest Clears"
}

export const IndividualLeaderboadGlobal = ({
    board,
    valueType = "number"
}: {
    board: RaidHubGlobalLeaderboardCategory
    valueType?: "number" | "duration"
}) => {
    const { page, handleBackwards, handleForwards, setPage } = usePage(["player"])
    const boardName = GlobalLeaderboards[board]
    const query = useQuery({
        queryKey: leaderboardQueryKey("global", board, {
            page,
            count: LEADERBOARD_ENTRIES_PER_PAGE
        }),
        queryFn: () =>
            getIndividualGlobalLeaderboard({ board, page, count: LEADERBOARD_ENTRIES_PER_PAGE })
    })

    const queryClient = useQueryClient()

    const searchParams = {
        type: "global",
        category: board,
        page,
        count: LEADERBOARD_ENTRIES_PER_PAGE
    } as const

    const { mutate: searchForLeaderboardPlayer, isLoading: isLoadingSearch } = useMutation({
        mutationKey: searchLeaderboardPlayerMutationKey(searchParams),
        mutationFn: (membershipId: string) => searchLeaderboardPlayer(searchParams, membershipId),
        onSuccess(result) {
            queryClient.setQueryData(
                leaderboardQueryKey("global", board, {
                    count: LEADERBOARD_ENTRIES_PER_PAGE,
                    page: page
                }),
                result.entries
            )
            setPage(result.page)
        }
    })

    const title = `${boardName} Leaderboards`
    const description = `${boardName} for all Raids in Destiny 2`

    return (
        <GenericIndividualLeaderboard
            title={title}
            description={description}
            cloudflareBannerId="5e4dc4de-9417-4aef-2a48-aea495ae3500"
            subtitle="Global Leaderboards"
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
