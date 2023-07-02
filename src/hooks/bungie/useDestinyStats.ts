import { useCallback, useEffect, useState } from "react"
import { BungieMembershipType, DestinyHistoricalStatsAccountResult } from "bungie-net-core/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"
import { getDestinyStats } from "../../services/bungie/getDestinyStats"

type UseDestinyStatsParams = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseDestinyStats = {
    stats: DestinyHistoricalStatsAccountResult | null
    isLoading: boolean
    characterIds: string[] | null
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

    const getProfileStats = useCallback(
        async (destinyMembershipId: string, membershipType: BungieMembershipType) =>
            getDestinyStats({
                destinyMembershipId,
                membershipType,
                client
            }),
        [client]
    )

    useEffect(() => {
        setLoading(true)
        getStats()

        async function getStats() {
            try {
                const profileStats = await getProfileStats(destinyMembershipId, membershipType)
                setCharacterIds(profileStats.characters.map(({ characterId }) => characterId))
                setStats(profileStats)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.ProfileStats)
            } finally {
                setLoading(false)
            }
        }
    }, [destinyMembershipId, membershipType, errorHandler, getProfileStats])
    return { stats, characterIds, isLoading }
}
