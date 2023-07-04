import { useCallback, useEffect, useState } from "react"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getDestinyStatsForCharacter } from "../../services/bungie/getDestinyStatsForCharacter"
import { AllRaidStats, ProfileWithCharacters } from "../../types/profile"
import { raidStatsMap } from "../../util/destiny/raidStatsMap"

type UseCharacterStats = (params: {
    characterProfiles: ProfileWithCharacters[] | null
    errorHandler: ErrorHandler
}) => {
    stats: AllRaidStats | null
    isLoading: boolean
}

export const useCharacterStats: UseCharacterStats = ({ characterProfiles, errorHandler }) => {
    const [stats, setStats] = useState<AllRaidStats | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (arr: ProfileWithCharacters[]) => {
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
                setStats(raidStatsMap(characterStats.flat().flatMap(stats => stats.activities)))
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
        if (characterProfiles) {
            fetchData(characterProfiles)
        }
    }, [characterProfiles, fetchData])
    return { stats, isLoading }
}
