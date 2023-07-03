import { useCallback, useEffect, useState } from "react"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getDestinyStatsForCharacter } from "../../services/bungie/getDestinyStatsForCharacter"
import { AllRaidStats } from "../../types/profile"
import { raidStatsMap } from "../../util/destiny/raidStatsMap"

type UseCharacterStatsParams = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    characterIds: string[] | null
    errorHandler: ErrorHandler
}

type UseCharacterStats = {
    stats: AllRaidStats | null
    isLoading: boolean
}

export function useCharacterStats({
    destinyMembershipId,
    membershipType,
    characterIds,
    errorHandler
}: UseCharacterStatsParams): UseCharacterStats {
    const [stats, setStats] = useState<AllRaidStats | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (
            destinyMembershipId: string,
            membershipType: BungieMembershipType,
            characterIds: string[]
        ) => {
            try {
                setStats(null)
                const characterStats = await Promise.all(
                    characterIds!.map(async characterId =>
                        getDestinyStatsForCharacter({
                            destinyMembershipId,
                            membershipType,
                            characterId,
                            client
                        })
                    )
                )
                setStats(raidStatsMap(characterStats.flatMap(stats => stats.activities)))
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.CharacterStats)
            } finally {
                setLoading(false)
            }
        },
        [client, errorHandler]
    )

    useEffect(() => {
        setLoading(true)
        if (characterIds?.length) {
            fetchData(destinyMembershipId, membershipType, characterIds)
        }
    }, [destinyMembershipId, membershipType, characterIds, fetchData])
    return { stats, isLoading }
}
