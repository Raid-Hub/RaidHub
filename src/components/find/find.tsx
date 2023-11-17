import { useMutation, useQuery } from "@tanstack/react-query"
import { z } from "zod"
import { activitySearch, activitySearchQuerySchema } from "~/services/raidhub/activitySearch"
import { RaidHubActivitySearchResult } from "~/types/raidhub-api"
import { wait } from "~/util/wait"

export default function Find({
    query,
    appendToQuery,
    removeFromQuery,
    searchString
}: {
    query: z.infer<typeof activitySearchQuerySchema>
    searchString: string
    appendToQuery: (key: string, value: string) => void
    removeFromQuery: (key: string, value?: string | undefined) => void
}) {
    console.log(query)

    const { mutate, isSuccess, data, isError, error, isLoading, reset } = useMutation<
        RaidHubActivitySearchResult[],
        Error
    >({
        mutationFn: () => wait(500).then(() => activitySearch(searchString))
    })

    const toggleFlawless = () =>
        query.flawless ? removeFromQuery("flawless") : appendToQuery("flawless", "true")
    return (
        <div>
            <div>
                <button onClick={toggleFlawless}>cccc</button>
                <button
                    onClick={() => {
                        reset()
                        mutate()
                    }}>
                    go go go
                </button>
            </div>
            {isError && <div>{error.message}</div>}
            {isLoading && <div>{"Loading..."}</div>}
            {isSuccess && (
                <div>
                    {data.map(r => (
                        <div key={r.instanceId}>
                            <div>{new Date(r.dateCompleted).toLocaleDateString()}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
