import { useCallback, useEffect, useState } from "react"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getDestinyStatsForCharacter } from "../../services/bungie/getDestinyStatsForCharacter"
import { AllRaidStats, MembershipWithCharacters } from "../../types/profile"
import RaidStatsCollection from "../../models/profile/RaidStatsCollection"

type UseCharacterStats = (params: {
    characterMemberships: MembershipWithCharacters[] | null
    errorHandler: ErrorHandler
}) => {
    stats: AllRaidStats | null
    isLoading: boolean
}

export const useCharacterStats: UseCharacterStats = ({ characterMemberships, errorHandler }) => {
    const [stats, setStats] = useState<AllRaidStats | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (arr: MembershipWithCharacters[]) => {
            try {
                setStats(null)
                const characterStats = await Promise.all(
                    arr!.map(({ destinyMembershipId, membershipType, characterIds }) =>
                        Promise.all(
                            characterIds.map(characterId =>
                                getDestinyStatsForCharacter({
                                    destinyMembershipId,
                                    membershipType,
                                    characterId,
                                    client
                                })
                            )
                        )
                    )
                )
                setStats(
                    RaidStatsCollection.groupActivities(
                        characterStats.flat().flatMap(stats => stats.activities)
                    )
                )
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.CharacterStats)
            } finally {
                setLoading(false)
            }
        },
        [client, errorHandler]
    )

    useEffect(() => {
        if (characterMemberships) {
            setLoading(true)
            fetchData(characterMemberships)
        }
    }, [characterMemberships, fetchData])
    return { stats, isLoading }
}
