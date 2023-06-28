import { useCallback, useEffect, useState } from "react"
import { EmblemDict, EmblemTuple, ErrorHandler } from "../../util/types"
import PGCRMember from "../../models/pgcr/Member"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"
import { BungieMembershipType } from "bungie-net-core/lib/models"

type UseEmblemsParams = { members: PGCRMember[] | null; errorHandler: ErrorHandler }

type UseEmblems = {
    emblems: EmblemDict | null
    isLoading: boolean
}

export function useEmblems({ members, errorHandler }: UseEmblemsParams): UseEmblems {
    const [emblems, setEmblems] = useState<EmblemDict | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()
    console.log("e")

    const getEmblem = useCallback(
        async (characterId: string, membershipId: string, membershipType: BungieMembershipType) => {
            return client.getCharacterEmblem(characterId, membershipId, membershipType)
        },
        [client]
    )

    useEffect(() => {
        if (!members) return

        setLoading(true)
        getEmblems(members)
        async function getEmblems(_members: PGCRMember[]) {
            try {
                const primaryEmblemsPromise: Promise<EmblemTuple[]> = Promise.all(
                    _members.map(({ characterIds, membershipId, membershipType }) =>
                        getEmblem(characterIds[0], membershipId, membershipType)
                            .then(emblem => [characterIds[0], emblem] as EmblemTuple)
                            .catch(() => [characterIds[0], ""] as EmblemTuple)
                    )
                )
                const remainingEmblemsPromise: Promise<EmblemTuple[][]> = Promise.all(
                    _members.map(({ characterIds, membershipId, membershipType }) =>
                        Promise.all(
                            characterIds.slice(1).map(characterId =>
                                getEmblem(characterId, membershipId, membershipType)
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
    }, [members, errorHandler, getEmblem])

    return { emblems, isLoading }
}
