import { useCallback } from "react"
import { useBungieClient } from "../../components/app/TokenManager"
import { getDestinyStats } from "../../services/bungie/getDestinyStats"
import { ProfileDetail } from "../../types/profile"
import { useQuery } from "@tanstack/react-query"

export const useDestinyStats = ({
    destinyMemberships
}: {
    destinyMemberships: ProfileDetail[] | null
}) => {
    const client = useBungieClient()

    const fetchData = useCallback(
        async (arr: ProfileDetail[]) => {
            const profileStats = await Promise.all(
                arr.map(
                    async ({ destinyMembershipId, membershipType }) =>
                        [
                            destinyMembershipId,
                            membershipType,
                            await getDestinyStats({
                                destinyMembershipId,
                                membershipType,
                                client
                            })
                        ] as const
                )
            )
            const characterMemberships = profileStats.map(
                ([destinyMembershipId, membershipType, stats]) => ({
                    destinyMembershipId,
                    membershipType,
                    characterIds: stats.characters.map(c => c.characterId)
                })
            )
            const historicalStats = profileStats.flatMap(([id, type, stats]) => stats.characters)

            return { characterMemberships, historicalStats }
        },
        [client]
    )

    return useQuery({
        queryKey: ["profileStats", destinyMemberships],
        queryFn: () => (destinyMemberships ? fetchData(destinyMemberships) : null),
        staleTime: 2 * 60000
    })
}
