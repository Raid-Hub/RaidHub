import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { EmblemDict, EmblemTuple, ErrorHandler } from "../util/types"
import PGCRMember from "../models/pgcr/Member"
import CustomError, { ErrorCode } from "../models/errors/CustomError"

type UseEmblemsParams = { members: PGCRMember[]; errorHandler: ErrorHandler }

type UseEmblems = {
    emblems: EmblemDict | null
    isLoading: boolean
}

export function useEmblems({ members, errorHandler }: UseEmblemsParams): UseEmblems {
    const [emblems, setEmblems] = useState<EmblemDict | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)

        getEmblems()
        async function getEmblems() {
            try {
                const primaryEmblemsPromise: Promise<EmblemTuple[]> = Promise.all(
                    members.map(({ characterIds, membershipId, membershipType }) =>
                        client
                            .getCharacterEmblem(characterIds[0], membershipId, membershipType)
                            .then(emblem => [characterIds[0], emblem] as EmblemTuple)
                            .catch(() => [characterIds[0], ""] as EmblemTuple)
                    )
                )
                const remainingEmblemsPromise: Promise<EmblemTuple[][]> = Promise.all(
                    members.map(({ characterIds, membershipId, membershipType }) =>
                        Promise.all(
                            characterIds.slice(1).map(characterId =>
                                client
                                    .getCharacterEmblem(characterId, membershipId, membershipType)
                                    .then(emblem => [characterId, emblem] as EmblemTuple)
                                    .catch(() => [characterId, ""] as EmblemTuple)
                            )
                        )
                    )
                )
                const primaryEmblems: EmblemTuple[] = await primaryEmblemsPromise
                setEmblems(Object.fromEntries(primaryEmblems))

                const remainingEmblems: EmblemTuple[] = (await remainingEmblemsPromise).flat()
                setEmblems(Object.fromEntries([...primaryEmblems, ...remainingEmblems]))
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.Emblems)
            } finally {
                setLoading(false)
            }
        }
    }, [members, errorHandler])

    return { emblems, isLoading }
}
