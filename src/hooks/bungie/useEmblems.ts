import { useCallback, useEffect, useState } from "react"
import PGCRMember from "../../models/pgcr/Player"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"
import { BungieMembershipType } from "bungie-net-core/models"
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

    const getEmblem = useCallback(
        async (
            characterId: string,
            destinyMembershipId: string,
            membershipType: BungieMembershipType
        ) => {
            return getCharacterEmblem({ characterId, destinyMembershipId, membershipType, client })
        },
        [client]
    )

    useEffect(() => {
        if (!members) return

        setLoading(true)
        getEmblems(members)
        async function getEmblems(_members: PGCRMember[]) {
            try {
                const primaryEmblemsPromise = Promise.all(
                    _members.map(({ characterIds, membershipId, membershipType }) =>
                        getEmblem(characterIds[0], membershipId, membershipType)
                            .then(emblem => [characterIds[0], emblem] as const)
                            .catch(() => [characterIds[0], ""] as const)
                    )
                )
                const remainingEmblemsPromise = Promise.all(
                    _members.map(({ characterIds, membershipId, membershipType }) =>
                        Promise.all(
                            characterIds.slice(1).map(characterId =>
                                getEmblem(characterId, membershipId, membershipType)
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
        }
    }, [members, errorHandler, getEmblem])

    return { emblems, isLoading }
}
