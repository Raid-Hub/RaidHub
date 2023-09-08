import { useBungieClient } from "~/components/app/TokenManager"
import { useQuery } from "@tanstack/react-query"
import { getGroup } from "~/services/bungie/getGroup"

export function useGroup({ groupId }: { groupId: string }) {
    const client = useBungieClient()

    return useQuery({
        queryKey: ["clan", groupId],
        queryFn: () => getGroup({ groupId, client }),
        staleTime: 10 * 60000 // clan does not update very often
    })
}
