import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import {
    BungieMembershipType,
    DestinyHistoricalStatsAccountResult
} from "bungie-net-core/lib/models"
import { ErrorHandler } from "../util/types"
import CustomError, { ErrorCode } from "../models/errors/CustomError"

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
    useEffect(() => {
        setLoading(true)
        getStats()

        async function getStats() {
            try {
                const profileStats = await client.getProfileStats({
                    destinyMembershipId: membershipId,
                    membershipType
                })
                setCharacterIds(profileStats?.characters.map(({ characterId }) => characterId))
                setStats(profileStats)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.ProfileStats)
            } finally {
                setLoading(false)
            }
        }
    }, [membershipId, membershipType])
    return { stats, characterIds, isLoading }
}
