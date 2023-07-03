import { useCallback, useEffect, useState } from "react"
import PGCRMember from "../../models/pgcr/Player"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getCharacterEmblem } from "../../services/bungie/getCharacterEmblem"
import { ErrorHandler } from "../../types/generic"

type UseEmblemsParams = { members: PGCRMember[] | null; errorHandler: ErrorHandler }

type EmblemDict = {
    [k: string]: string
}
type UseEmblems = {
    emblems: EmblemDict | null
    isLoading: boolean
}

export function useEmblems({ members, errorHandler }: UseEmblemsParams): UseEmblems {
    const [emblems, setEmblems] = useState<EmblemDict | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (members: PGCRMember[]) => {
            try {
                setEmblems(null)
                const primaryEmblemsPromise = Promise.all(
                    members.map(({ characterIds, membershipId, membershipType }) =>
                        getCharacterEmblem({
                            characterId: characterIds[0],
                            destinyMembershipId: membershipId,
                            membershipType,
                            client
                        })
                            .then(emblem => [characterIds[0], emblem] as const)
                            .catch(() => [characterIds[0], ""] as const)
                    )
                )
                const remainingEmblemsPromise = Promise.all(
                    members.map(({ characterIds, membershipId, membershipType }) =>
                        Promise.all(
                            characterIds.slice(1).map(characterId =>
                                getCharacterEmblem({
                                    characterId,
                                    destinyMembershipId: membershipId,
                                    membershipType,
                                    client
                                })
                                    .then(emblem => [characterId, emblem] as const)
                                    .catch(() => [characterId, ""] as const)
                            )
                        )
                    )
                )
                const primaryEmblems = await primaryEmblemsPromise
                setEmblems(Object.fromEntries(primaryEmblems))

                const remainingEmblems = (await remainingEmblemsPromise).flat()
                setEmblems(Object.fromEntries([...primaryEmblems, ...remainingEmblems]))
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
        if (members) {
            fetchData(members)
        }
    }, [members, fetchData])

    return { emblems, isLoading }
}
