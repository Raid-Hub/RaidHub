import { useQuery } from "@tanstack/react-query"
import { getRaidHubApi } from "./common"

export const useClanStats = ({ groupId }: { groupId: string }) => {
    return useQuery({
        queryKey: ["raidhub", "clan", groupId],
        queryFn: ({ queryKey }) =>
            getRaidHubApi(
                "/clan/{groupId}",
                {
                    groupId: queryKey[2]
                },
                null
            ).then(res => res.response),
        staleTime: 300_000
    })
}
