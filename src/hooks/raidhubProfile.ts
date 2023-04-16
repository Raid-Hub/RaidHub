import { useEffect, useState } from "react"
import { wait } from "../util/math"

type X = { pinnedActivity: string | null }

type UseRaidHubProfile = {
    profile: X | null
    isLoading: boolean
}

export function useRaidHubProfile(membershipId: string): UseRaidHubProfile {
    const [profile, setProfile] = useState<X | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        // TODO
        const getRaidHubProfile = async () => {
            await wait(5000)
            if (membershipId === "4611686018488107374") setProfile({ pinnedActivity: "4129239230" })
            else setProfile({ pinnedActivity: null })
            setLoading(false)
        }
        getRaidHubProfile()
    }, [membershipId])
    return { profile, isLoading }
}
