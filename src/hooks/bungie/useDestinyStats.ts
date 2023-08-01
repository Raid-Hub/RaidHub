import { useCallback, useEffect, useState } from "react"
import {
    BungieMembershipType,
    DestinyHistoricalStatsPerCharacter
} from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getDestinyStats } from "../../services/bungie/getDestinyStats"
import { ProfileDetails, MembershipWithCharacters } from "../../types/profile"

type UseDestinyStats = (params: {
    destinyMemberships: ProfileDetails[] | null
    errorHandler: ErrorHandler
}) => {
    historicalStats: DestinyHistoricalStatsPerCharacter[] | null
    characterMemberships: MembershipWithCharacters[] | null
    isLoading: boolean
}

export const useDestinyStats: UseDestinyStats = ({ destinyMemberships, errorHandler }) => {
    const [historicalStats, setStats] = useState<DestinyHistoricalStatsPerCharacter[] | null>(null)
    const [characterMemberships, setCharacterMemberships] = useState<
        MembershipWithCharacters[] | null
    >(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (arr: { destinyMembershipId: string; membershipType: BungieMembershipType }[]) => {
            try {
                setCharacterMemberships(null)
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
                setCharacterMemberships(
                    profileStats.map(([destinyMembershipId, membershipType, stats]) => ({
                        destinyMembershipId,
                        membershipType,
                        characterIds: stats.characters.map(c => c.characterId)
                    }))
                )
                setStats(profileStats.flatMap(([id, type, stats]) => stats.characters))
            } catch (e: any) {
                setError(e)
            } finally {
                setLoading(false)
            }
        },
        [client]
    )

    useEffect(() => {
        error && CustomError.handle(errorHandler, error, ErrorCode.ProfileStats)
    }, [error, errorHandler])

    useEffect(() => {
        setLoading(true)
        if (destinyMemberships) {
            fetchData(destinyMemberships)
        }
    }, [destinyMemberships, fetchData])
    return { historicalStats, characterMemberships, isLoading }
}
