import type { DestinyCharacterResponse } from "bungie-net-core/models/Destiny/Responses/DestinyCharacterResponse"
import { useCharacter } from "~/services/bungie/useCharacter"
import { useRaidHubResolvePlayer } from "~/services/raidhub/useRaidHubResolvePlayers"
import { usePGCRContext } from "../PGCRStateManager"
import type DestinyPGCRCharacter from "../models/Character"

export const useResolveCharacter = <T = DestinyCharacterResponse<[200]>>(
    character: DestinyPGCRCharacter,
    opts?: {
        forceOnLargePGCR?: boolean
        select?: (data: DestinyCharacterResponse<[200]>) => T
    }
) => {
    const { pgcrPlayers } = usePGCRContext()

    const isEnabled =
        !character.destinyUserInfo.membershipType &&
        (!!opts?.forceOnLargePGCR ||
            (pgcrPlayers && pgcrPlayers.reduce((count, p) => count + p.characters.size, 0) < 20))

    const resolveQuery = useRaidHubResolvePlayer(character.destinyUserInfo.membershipId, {
        enabled: isEnabled
    })

    return useCharacter(
        {
            destinyMembershipId: character.destinyUserInfo.membershipId,
            membershipType: resolveQuery.data?.membershipType ?? 0,
            characterId: character.characterId
        },
        {
            enabled: resolveQuery.isSuccess && isEnabled,
            placeholderData: {
                character: {
                    data: {
                        classHash: character.classHash ?? 0
                    }
                }
            } as DestinyCharacterResponse<[200]>,
            staleTime: 3600_000,
            ...opts
        }
    )
}
