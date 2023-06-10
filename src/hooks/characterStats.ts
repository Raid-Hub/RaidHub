import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { BungieMembershipType, DestinyAggregateActivityResults } from "bungie-net-core/lib/models"
import AggregateStats from "../models/profile/AggregateStats"
import { ErrorHandler } from "../util/types"
import CustomError, { ErrorCode } from "../models/errors/CustomError"

type UseCharacterStatsParams = {
    membershipId: string
    membershipType: BungieMembershipType
    characterIds: string[] | null
    errorHandler: ErrorHandler
}

type UseCharacterStats = {
    stats: AggregateStats | null
    isLoading: boolean
}

export function useCharacterStats({
    membershipId,
    membershipType,
    characterIds,
    errorHandler
}: UseCharacterStatsParams): UseCharacterStats {
    const [stats, setStats] = useState<AggregateStats | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        if (characterIds?.length) getStats()

        async function getStats() {
            try {
                const characterStats = await Promise.all(
                    characterIds!.map(async characterId =>
                        client.getCharacterStats({
                            destinyMembershipId: membershipId,
                            membershipType,
                            characterId
                        })
                    )
                )
                setStats(new AggregateStats(characterStats))
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.CharacterStats)
            } finally {
                setLoading(false)
            }
        }
    }, [membershipId, membershipType, characterIds, errorHandler])
    return { stats, isLoading }
}
