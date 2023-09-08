import { useQuery } from "@tanstack/react-query"
import { useBungieClient } from "~/components/app/TokenManager"
import { getLiveProfileData } from "~/services/bungie/getLiveProfileData"
import { FireTeamMember } from "~/types/profile"

export function useLiveData(member: FireTeamMember) {
    const client = useBungieClient()
    return useQuery({
        queryKey: ["liveData", member],
        queryFn: () =>
            getLiveProfileData({
                client,
                destinyMembershipId: member.destinyMembershipId,
                membershipType: member.destinyMembershipType
            }).then(data =>
                data.characters.data
                    ? {
                          ...data,
                          mostRecentCharacterId: Object.values(data.characters.data).reduce(
                              (base, current) =>
                                  new Date(current.dateLastPlayed).getTime() >
                                  new Date(base.dateLastPlayed).getTime()
                                      ? current
                                      : base
                          ).characterId
                      }
                    : null
            ),
        refetchOnWindowFocus: true,
        staleTime: 20000
    })
}
