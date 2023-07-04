import { useCallback, useEffect, useState } from "react"
import {
    BungieMembershipType,
    DestinyHistoricalStatsPerCharacter
} from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getDestinyStats } from "../../services/bungie/getDestinyStats"
import { ProfileDetails, ProfileWithCharacters } from "../../types/profile"

type UseDestinyStats = (params: {
    destinyProfiles: ProfileDetails[] | null
    errorHandler: ErrorHandler
}) => {
    stats: DestinyHistoricalStatsPerCharacter[] | null
    characterProfiles: ProfileWithCharacters[] | null
    isLoading: boolean
}

export const useDestinyStats: UseDestinyStats = ({ destinyProfiles, errorHandler }) => {
    const [stats, setStats] = useState<DestinyHistoricalStatsPerCharacter[] | null>(null)
    const [characterProfiles, setCharacterProfiles] = useState<ProfileWithCharacters[] | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (arr: { destinyMembershipId: string; membershipType: BungieMembershipType }[]) => {
            try {
                setCharacterProfiles(null)
                setStats(null)

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
                setCharacterProfiles(
                    profileStats.map(([destinyMembershipId, membershipType, stats]) => ({
                        destinyMembershipId,
                        membershipType,
                        characterIds: stats.characters.map(c => c.characterId)
                    }))
                )
                setStats(profileStats.flatMap(([id, type, stats]) => stats.characters))
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
        if (destinyProfiles) {
            fetchData(destinyProfiles)
        }
    }, [destinyProfiles, fetchData])
    return { stats, characterProfiles, isLoading }
}
