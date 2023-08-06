import { useCallback, useEffect, useState } from "react"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getDestinyStatsForCharacter } from "../../services/bungie/getDestinyStatsForCharacter"
import { MembershipWithCharacters } from "../../types/profile"
import RaidStatsCollection from "../../models/profile/data/RaidStatsCollection"
import { useQuery } from "@tanstack/react-query"

export const useCharacterStats = ({
    characterMemberships,
    errorHandler
}: {
    characterMemberships: MembershipWithCharacters[] | null
    errorHandler: ErrorHandler
}) => {
    const client = useBungieClient()

    const fetchData = useCallback(
        async (arr: MembershipWithCharacters[]) => {
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
            return RaidStatsCollection.groupActivities(
                characterStats.flat().flatMap(stats => stats.activities)
            )
        },
        [client]
    )

    return useQuery({
        queryKey: ["bungieMemberships", characterMemberships],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.CharacterStats),
        queryFn: () => (characterMemberships ? fetchData(characterMemberships) : null),
        staleTime: 2 * 60000 // character stats change often
    })
}
