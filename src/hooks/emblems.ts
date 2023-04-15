import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { PGCRMember } from "../models/pgcr/Entry"
import { EmblemDict, EmblemTuple } from "../util/types"

type UseEmblemsParams = PGCRMember[] | null

type UseEmblems = {
    emblems: EmblemDict | null
    error: string | null
    isLoading: boolean
}

export function useEmblems(members: UseEmblemsParams): UseEmblems {
    const [emblems, setEmblems] = useState<EmblemDict | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        const errs: string[] = []
        const emblemsList: EmblemTuple[] = []
        Promise.all(
            members?.map(member =>
                client
                    .getCharacterEmblem(
                        member.characterIds[0],
                        member.membershipId,
                        member.membershipType
                    )
                    .then(emblem => emblemsList.push([member.characterIds[0], emblem]))
                    .catch(err => {
                        errs.push(err)
                        emblemsList.push([member.characterIds[0], ""])
                    })
            ) ?? []
        )
            .then(() => {
                setEmblems(Object.fromEntries(emblemsList))
                setError(errs.join(", ") || null)
            })
            .finally(() => setLoading(false))
    }, [members])

    return { emblems, error, isLoading }
}
