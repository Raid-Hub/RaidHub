import { useMutation } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useCallback, useRef } from "react"
import { RaidHubAdminQueryBody } from "~/types/raidhub-api"
import { postRaidHubApi } from "."

export const useRaidHubAdminQuery = () => {
    const abortController = useRef(new AbortController())
    const session = useSession()

    const mutation = useMutation({
        mutationKey: ["raidhub", "admin", "query"] as const,
        mutationFn: (body: RaidHubAdminQueryBody) =>
            postRaidHubApi("/admin/query", null, body, {
                headers: session.data?.raidHubAccessToken?.value
                    ? {
                          Authorization: "Bearer " + session.data.raidHubAccessToken.value
                      }
                    : {},
                signal: abortController.current.signal
            })
    })

    if (mutation.error instanceof Error && mutation.error.name === "AbortError") {
        mutation.reset()
        abortController.current = new AbortController()
    }

    const cancel = useCallback(() => {
        abortController.current.abort()
    }, [abortController])

    return { ...mutation, cancel }
}
