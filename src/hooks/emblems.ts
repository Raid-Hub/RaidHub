import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { EmblemDict, EmblemTuple, ErrorHandler } from "../util/types"
import PGCRMember from "../models/pgcr/Member"

type UseEmblemsParams = { members: PGCRMember[] }

type UseEmblems = {
    emblems: EmblemDict | null
    isLoading: boolean
}

export function useEmblems({ members }: UseEmblemsParams): UseEmblems {
    const [emblems, setEmblems] = useState<EmblemDict | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        const emblemsList: EmblemTuple[] = []
        Promise.all(
            members?.map(({ characterIds, membershipId, membershipType }) =>
                client
                    .getCharacterEmblem(characterIds[0], membershipId, membershipType)
                    .then(emblem => emblemsList.push([characterIds[0], emblem]))
                    .catch(() => emblemsList.push([characterIds[0], ""]))
            ) ?? []
        )
            .then(() => {
                setEmblems(Object.fromEntries(emblemsList))
            })
            .finally(() => setLoading(false))
    }, [members])

    return { emblems, isLoading }
}
