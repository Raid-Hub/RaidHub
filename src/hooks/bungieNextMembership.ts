import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { BungieMembershipType, UserInfoCard } from "oodestiny/schemas"

type UseBungieProfileParams =
    | {
          membershipId: string
          membershipType: BungieMembershipType
      }
    | undefined

type UseBungieProfile = {
    membership: UserInfoCard | undefined
    isLoading: boolean
}

export function useBungieNextMembership(params: UseBungieProfileParams): UseBungieProfile {
    const [membership, setMembership] = useState<UserInfoCard | undefined>(undefined)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        if (params?.membershipId && params.membershipType)
            client
                .getBungieNextMembership(params.membershipId, params.membershipType)
                .then(membership => setMembership(membership))
                .finally(() => setLoading(false))
    }, [params])
    return { membership, isLoading }
}
