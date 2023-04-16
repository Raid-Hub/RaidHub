import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { BungieMembershipType, DestinyAggregateActivityResults } from "oodestiny/schemas"

type UseCharacterStatsParams = {
    membershipId: string
    membershipType: BungieMembershipType
    characterIds: string[] | null
}

type UseCharacterStats = {
    stats: Map<string, DestinyAggregateActivityResults> | null
    isLoading: boolean
}

export function useCharacterStats({
    membershipId,
    membershipType,
    characterIds
}: UseCharacterStatsParams): UseCharacterStats {
    const [stats, setStats] = useState<Map<string, DestinyAggregateActivityResults> | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        const getStats = async () => {
            const characterStats = new Map(
                await Promise.all(
                    characterIds!.map(
                        async (
                            characterId
                        ): Promise<
                            [characterId: string, stats: DestinyAggregateActivityResults]
                        > => [
                            characterId,
                            await client.getCharacterStats({
                                destinyMembershipId: membershipId,
                                membershipType,
                                characterId
                            })
                        ]
                    )
                )
            )
            setStats(stats)
            setLoading(false)
        }
        if (characterIds) getStats()
    }, [membershipId, membershipType, characterIds])
    return { stats, isLoading }
}
