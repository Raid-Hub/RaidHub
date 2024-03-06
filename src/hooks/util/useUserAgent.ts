import { useEffect, useState } from "react"

export const useUserAgent = () => {
    const [userAgent, setUserAgent] = useState<string | null>(null)
    useEffect(() => {
        if (navigator.userAgent) {
            setUserAgent(navigator.userAgent)
        }
    }, [])

    return userAgent
}
