import { useCallback, useEffect, useState } from "react"
import {
    BungieMembershipType,
    DestinyHistoricalStatsAccountResult
} from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../util/types"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"

type UseProfileStatsParams = {
    membershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseProfileStats = {
    stats: DestinyHistoricalStatsAccountResult | null
    isLoading: boolean
    characterIds: string[] | null
}

export function useProfileStats({
    membershipId,
    membershipType,
    errorHandler
}: UseProfileStatsParams): UseProfileStats {
    const [stats, setStats] = useState<DestinyHistoricalStatsAccountResult | null>(null)
    const [characterIds, setCharacterIds] = useState<string[] | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()
    console.log("g")

    const getProfileStats = useCallback(
        async (destinyMembershipId: string, membershipType: BungieMembershipType) => {
            return client.getProfileStats({
                destinyMembershipId,
                membershipType
            })
        },
        [client]
    )

    useEffect(() => {
        setLoading(true)
        getStats()

        async function getStats() {
            try {
                const profileStats = await getProfileStats(membershipId, membershipType)
                setCharacterIds(profileStats?.characters.map(({ characterId }) => characterId))
                setStats(profileStats)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.ProfileStats)
            } finally {
                setLoading(false)
            }
        }
    }, [membershipId, membershipType, errorHandler, getProfileStats])
    return { stats, characterIds, isLoading }
}
