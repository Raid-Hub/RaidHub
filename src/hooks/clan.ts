import { BungieMembershipType } from "bungie-net-core/lib/models"
import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { Clan, ErrorHandler } from "../util/types"

type UseClanParams = {
    membershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseClan = {
    clan: Clan | null
    isLoading: boolean
}

export function useClan({ membershipId, membershipType, errorHandler }: UseClanParams): UseClan {
    const [clan, setClan] = useState<Clan | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        client
            .getClan(membershipId, membershipType)
            .then(clan => setClan(clan))
            .catch(errorHandler)
            .finally(() => setLoading(false))
    }, [membershipId])
    return { clan, isLoading }
}
