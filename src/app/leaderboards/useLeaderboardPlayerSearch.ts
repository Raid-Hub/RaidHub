import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { type RaidHubLeaderboardData } from "~/services/raidhub/types"

export const useLeaderboardPlayerSearch = ({
    queryKeyWithoutPage,
    mutationFn
}: {
    mutationFn: (args: { search: string; count?: number }) => Promise<RaidHubLeaderboardData>
    queryKeyWithoutPage: QueryKey
}) => {
    const { set, update, remove } = useQueryParams<{ page: string; position: string }>()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [...queryKeyWithoutPage, "search"],
        mutationFn: mutationFn,
        onMutate: () => {
            remove("position")
        },
        onSuccess: (data, q) => {
            const qk = Array.from(queryKeyWithoutPage)
            qk.push(data.page)

            queryClient.setQueryData<RaidHubLeaderboardData>(qk, data)

            set(
                "position",
                String(
                    data.entries.find(e => {
                        if ("playerInfo" in e) {
                            return e.playerInfo.membershipId === q.search
                        } else {
                            return e.players.some(e => e.membershipId === q.search)
                        }
                    })
                ),
                {
                    commit: false
                }
            )
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
