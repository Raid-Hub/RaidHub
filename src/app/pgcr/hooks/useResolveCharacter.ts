import type { DestinyCharacterResponse } from "bungie-net-core/models/Destiny/Responses/DestinyCharacterResponse"
import { useCharacter } from "~/services/bungie/hooks"
import { useRaidHubResolvePlayer } from "~/services/raidhub/hooks"
import { type RaidHubInstanceCharacter } from "~/services/raidhub/types"
import { usePGCRContext } from "../PGCRStateManager"

export const useResolveCharacter = <T = DestinyCharacterResponse<[200]>>(
    character: RaidHubInstanceCharacter,
    opts?: {
        forceOnLargePGCR?: boolean
        select?: (data: DestinyCharacterResponse<[200]>) => T
    }
) => {
    const { data, isSuccess } = usePGCRContext()

    const player = data?.players.find(p =>
        p.characters.find(c => c.characterId === character.characterId)
    )?.playerInfo

    const isEnabled = isSuccess && (!!opts?.forceOnLargePGCR || data.playerCount <= 50)
    const shouldFetch = !character.classHash

    const resolveQuery = useRaidHubResolvePlayer(player?.membershipId ?? "0", {
        enabled: isEnabled
    })

    return useCharacter(
        {
            destinyMembershipId: resolveQuery.data?.membershipId ?? "0",
            membershipType: resolveQuery.data?.membershipType ?? 0,
            characterId: character.characterId
        },
        {
            enabled: resolveQuery.isSuccess && isEnabled && shouldFetch,
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
