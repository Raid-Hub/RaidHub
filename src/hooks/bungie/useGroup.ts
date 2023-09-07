import { useBungieClient } from "~/components/app/TokenManager"
import { useQuery } from "@tanstack/react-query"
import { getGroup } from "~/services/bungie/getGroup"
import { useClanBanner } from "~/components/app/DestinyManifestManager"
import { GroupResponse } from "bungie-net-core/models"
import { Clan } from "~/types/profile"

export function useGroup({ groupId }: { groupId: string }) {
    const client = useBungieClient()

    const { data, ...query } = useQuery({
        queryKey: ["clan", groupId],
        queryFn: () => getGroup({ groupId, client }),
        staleTime: 10 * 60000 // clan does not update very often
    })

    const { data: clanBanner } = useClanBanner(data?.detail.clanInfo.clanBannerData ?? null)

    return {
        data: data
            ? ({
                  ...data,
                  detail: {
                      ...data?.detail,
                      clanBanner: clanBanner ?? null
                  }
              } satisfies GroupResponse & { detail: Clan })
            : undefined,
        ...query
    }
}
