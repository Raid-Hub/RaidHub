import { useCallback, useEffect, useState } from "react"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import AggregateStats from "../../models/profile/AggregateStats"
import { ErrorHandler } from "../../util/types"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"

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
    const client = useBungieClient()

    const getCharacterStats = useCallback(
        async (
            destinyMembershipId: string,
            membershipType: BungieMembershipType,
            characterId: string
        ) => {
            return client.getCharacterStats({
                destinyMembershipId,
                membershipType,
                characterId
            })
        },
        [client]
    )

    useEffect(() => {
        setLoading(true)
        if (characterIds?.length) getStats()

        async function getStats() {
            try {
                const characterStats = await Promise.all(
                    characterIds!.map(async characterId =>
                        getCharacterStats(membershipId, membershipType, characterId)
                    )
                )
                setStats(new AggregateStats(characterStats))
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.CharacterStats)
            } finally {
                setLoading(false)
            }
        }
    }, [membershipId, membershipType, characterIds, errorHandler, getCharacterStats])
    return { stats, isLoading }
}
