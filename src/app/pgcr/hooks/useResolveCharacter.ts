import type { DestinyCharacterResponse } from "bungie-net-core/models/Destiny/Responses/DestinyCharacterResponse"
import { useCharacter } from "~/services/bungie/hooks"
import { useRaidHubResolvePlayer } from "~/services/raidhub/hooks"
import { type RaidHubActivityCharacter } from "~/services/raidhub/types"
import { usePGCRContext } from "../PGCRStateManager"

export const useResolveCharacter = <T = DestinyCharacterResponse<[200]>>(
    character: RaidHubActivityCharacter,
    opts?: {
        forceOnLargePGCR?: boolean
        select?: (data: DestinyCharacterResponse<[200]>) => T
    }
) => {
    const { data } = usePGCRContext()

    const player = data?.players.find(p =>
        p.data.characters.find(c => c.characterId === character.characterId)
    )?.player

    const isEnabled =
        data && !player?.membershipType && (!!opts?.forceOnLargePGCR || data.playerCount <= 50)

    const resolveQuery = useRaidHubResolvePlayer(player?.membershipId ?? "", {
        enabled: isEnabled
    })

    return useCharacter(
        {
            destinyMembershipId: resolveQuery.data?.membershipId ?? "",
            membershipType: resolveQuery.data?.membershipType ?? 0,
            characterId: character.characterId
        },
        {
            enabled: resolveQuery.isSuccess && isEnabled,
            placeholderData: {
                character: {
                    data: {
                        classHash: Number(character.classHash ?? 0)
                    }
                }
            } as DestinyCharacterResponse<[200]>,
            staleTime: 3600_000,
            ...opts
        }
    )
}
