"use client"

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { searchLeaderboardPlayer } from "~/services/raidhub/searchLeaderboardPlayer"
import type {
    RaidHubIndividualLeaderboardEntry,
    RaidHubLeaderboardSearchQuery,
    RaidHubWorldfirstLeaderboardEntry
} from "~/services/raidhub/types"
import type { AtLeast } from "~/types/generic"

export const useLeaderboardPlayerSearch = ({
    resultQueryKey,
    ...query
}: AtLeast<Omit<RaidHubLeaderboardSearchQuery, "membershipId">, "count"> & {
    resultQueryKey: QueryKey
}) => {
    const { set, update, remove } = useQueryParams<{ page: string; position: string }>()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["raidhub", "leaderboard-player", query],
        mutationFn: (membershipId: string) => searchLeaderboardPlayer(query, membershipId),
        onMutate: () => {
            remove("position")
        },
        onSuccess: data => {
            const qk = Array.from(resultQueryKey)
            qk[resultQueryKey.length - 1] = data.page

            queryClient.setQueryData<{
                entries: readonly (
                    | RaidHubIndividualLeaderboardEntry
                    | RaidHubWorldfirstLeaderboardEntry
                )[]
            }>(qk, old => ({ ...old, entries: data.entries }))

            set("position", String(data.position), {
                commit: false
            })
            update("page", old => ({
                value: String(data.page),
                args: {
                    commit: true,
                    shallow: String(data.page) === old
                }
            }))
        }
    })
}
