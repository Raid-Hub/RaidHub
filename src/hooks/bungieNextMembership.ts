import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { BungieMembershipType, UserInfoCard } from "oodestiny/schemas"

type UseBungieProfileParams = {
    membershipId: string
    membershipType: BungieMembershipType
}

type UseBungieProfile = {
    membership: UserInfoCard | undefined
    isLoading: boolean
}

export function useBungieNextMembership({
    membershipId,
    membershipType
}: UseBungieProfileParams): UseBungieProfile {
    const [membership, setMembership] = useState<UserInfoCard | undefined>(undefined)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        client
            .getBungieNextMembership(membershipId, membershipType)
            .then(membership => setMembership(membership))
            .finally(() => setLoading(false))
    }, [membershipId, membershipType])
    return { membership, isLoading }
}
