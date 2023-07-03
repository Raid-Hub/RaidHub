import { useCallback, useEffect, useState } from "react"
import { BungieMembershipType, DestinyHistoricalStatsAccountResult } from "bungie-net-core/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getDestinyStats } from "../../services/bungie/getDestinyStats"

type UseDestinyStatsParams = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseDestinyStats = {
    stats: DestinyHistoricalStatsAccountResult | null
    characterIds: string[] | null
    isLoading: boolean
}

export function useDestinyStats({
    destinyMembershipId,
    membershipType,
    errorHandler
}: UseDestinyStatsParams): UseDestinyStats {
    const [stats, setStats] = useState<DestinyHistoricalStatsAccountResult | null>(null)
    const [characterIds, setCharacterIds] = useState<string[] | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (destinyMembershipId: string, membershipType: BungieMembershipType) => {
            try {
                setCharacterIds(null)
                setStats(null)
                const profileStats = await getDestinyStats({
                    destinyMembershipId,
                    membershipType,
                    client
                })
                setCharacterIds(profileStats.characters.map(({ characterId }) => characterId))
                setStats(profileStats)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.ProfileStats)
            } finally {
                setLoading(false)
            }
        },
        [client, errorHandler]
    )

    useEffect(() => {
        setLoading(true)
        fetchData(destinyMembershipId, membershipType)
    }, [destinyMembershipId, membershipType, fetchData])
    return { stats, characterIds, isLoading }
}
