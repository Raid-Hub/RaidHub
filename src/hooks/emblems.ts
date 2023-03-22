import { BungieMembershipType } from "oodestiny/schemas"
import { useEffect, useState } from "react"
import { shared as client } from "../util/bungie-client"

type UseEmblemsParams = {
    membershipId: string
    membershipType: BungieMembershipType
    characterId: string
}[] | undefined

export type EmblemDict = { [characterId: string]: string }

type EmblemTuple = [id: string, emblem: string]

interface UseEmblems {
    emblems: EmblemDict | null
    error: string | null
}

export function useEmblems(members: UseEmblemsParams): UseEmblems {
    const [emblems, setEmblems] = useState<EmblemDict | null>(null)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const errs: string[] = []
        const emblemsList: EmblemTuple[] = []
        Promise.all(members?.map(member =>
            client.getCharacterEmblem(member.characterId, member.membershipId, member.membershipType)
                .then(emblem => emblemsList.push([member.characterId, emblem]))
                .catch(err => {
                    errs.push(err)
                    emblemsList.push([member.characterId, ""])
                })) ?? [])
            .then(() => {
                setEmblems(Object.fromEntries(emblemsList))
                setError(errs.join(", ") || null)
            })
    }, [members])

    return { emblems, error }
}