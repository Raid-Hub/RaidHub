import { useCallback, useEffect, useState } from "react"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getCharacterEmblem } from "../../services/bungie/getCharacterEmblem"
import { ErrorHandler, Loading } from "../../types/generic"
import DestinyPGCRCharacter from "../../models/pgcr/Character"

type UseEmblemsParams = {
    characters: DestinyPGCRCharacter[] | null
    pgcrLoadingState: Loading
    errorHandler: ErrorHandler
}

type EmblemDict = {
    [k: string]: string
}
type UseEmblems = {
    emblems: EmblemDict | null
    isLoading: boolean
}

export function useEmblems({
    characters,
    errorHandler,
    pgcrLoadingState
}: UseEmblemsParams): UseEmblems {
    const [emblems, setEmblems] = useState<EmblemDict | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (entries: DestinyPGCRCharacter[]) => {
            try {
                setEmblems(null)
                const emblemDict = await Promise.all(
                    entries.map(({ characterId, membershipId, membershipType }) => {
                        if (!membershipType) {
                            return [characterId, ""]
                        } else {
                            return getCharacterEmblem({
                                characterId,
                                destinyMembershipId: membershipId,
                                membershipType,
                                client
                            })
                                .then(emblem => [characterId, emblem] as const)
                                .catch(() => [characterId, ""] as const)
                        }
                    })
                )
                setEmblems(Object.fromEntries(emblemDict))
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.Emblems)
            } finally {
                setLoading(false)
            }
        },
        [client, errorHandler]
    )

    useEffect(() => {
        setLoading(true)
        if (characters && !pgcrLoadingState) {
            fetchData(characters)
        }
    }, [characters, fetchData, pgcrLoadingState])

    return { emblems, isLoading }
}
