import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import {
    BungieMembershipType,
    DestinyHistoricalStatsAccountResult
} from "bungie-net-core/lib/models"

type UseProfileStatsParams = {
    membershipId: string
    membershipType: BungieMembershipType
}

type UseProfileStats = {
    stats: DestinyHistoricalStatsAccountResult | null
    isLoading: boolean
    characterIds: string[] | null
}

export function useProfileStats({
    membershipId,
    membershipType
}: UseProfileStatsParams): UseProfileStats {
    const [stats, setStats] = useState<DestinyHistoricalStatsAccountResult | null>(null)
    const [characterIds, setCharacterIds] = useState<string[] | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        const getStats = async () => {
            const profileStats = await client.getProfileStats({
                destinyMembershipId: membershipId,
                membershipType
            })
            setCharacterIds(profileStats?.characters.map(({ characterId }) => characterId))
            setStats(profileStats)
            setLoading(false)
        }
        getStats()
    }, [membershipId, membershipType])
    return { stats, characterIds, isLoading }
}
