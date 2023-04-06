import { BungieMembershipType, GroupV2 } from "oodestiny/schemas"
import { useEffect, useState } from "react"
import { shared as client } from "../util/bungie-client"
import { Clan } from "../util/types"

type UseClanParams = {
    membershipId: string
    membershipType: BungieMembershipType,
}

type UseClan = {
    clan: Clan | null
    isLoading: boolean
}

export function useClan({ membershipId, membershipType }: UseClanParams): UseClan {
    const [clan, setClan] = useState<Clan | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        client.getClan(membershipId, membershipType).then(clan => {
            setClan(clan)
            setLoading(false)
        })
    }, [])
    return { clan, isLoading };
}