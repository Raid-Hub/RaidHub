import {
    DestinyActivityDefinition,
    DestinyActivityModeDefinition,
    DestinyProfileTransitoryComponent,
    DestinyProfileUserInfoCard
} from "bungie-net-core/models"
import { ErrorHandler } from "@/types/generic"
import { BungieMembershipType } from "bungie-net-core/models"
import { useBungieClient } from "@/components/app/TokenManager"
import CustomError, { ErrorCode } from "@/models/errors/CustomError"
import { getProfileTransitory } from "@/services/bungie/getProfileTransitory"
import {
    getActivityDefiniton,
    getActivityModeDefiniton
} from "@/services/bungie/getActivityDefinition"
import { getLinkedDestinyProfile } from "@/services/bungie/getLinkedDestinyProfile"
import { useQuery } from "@tanstack/react-query"

export type TransitoryActivity = {
    transitory: DestinyProfileTransitoryComponent
    activityDefinition: DestinyActivityDefinition & { orbit: boolean }
    activityModeDefinition: DestinyActivityModeDefinition | null
    partyMembers: DestinyProfileUserInfoCard[]
}

type UseProfileTransitory = {
    profile: TransitoryActivity | null
    lastRefresh: Date
    isLoading: boolean
}

const REFRESH_INTERVAL = 30 * 1000

export const useProfileTransitory = ({
    destinyMembershipId,
    destinyMembershipType,
    errorHandler
}: {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
    errorHandler: ErrorHandler
}): UseProfileTransitory => {
    const client = useBungieClient()

    const transitoryQuery = useQuery({
        queryKey: ["profileTransitory", destinyMembershipId, destinyMembershipType],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.Transitory),
        queryFn: () =>
            getProfileTransitory({
                destinyMembershipId,
                membershipType: destinyMembershipType,
                client
            }),
        staleTime: 5000,
        refetchInterval: REFRESH_INTERVAL
    })

    const activityDefinitionQuery = useQuery({
        queryKey: ["activityDefinition", transitoryQuery.data?.current.currentActivityHash],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.Transitory),
        queryFn: () =>
            transitoryQuery.data
                ? getActivityDefiniton({
                      hashIdentifier: transitoryQuery.data.current.currentActivityHash,
                      client
                  })
                : null,
        staleTime: Infinity
    })

    const activityModeDefinitionQuery = useQuery({
        queryKey: ["activityModeDefinition", transitoryQuery.data?.current.currentActivityModeHash],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.Transitory),
        queryFn: () =>
            transitoryQuery.data
                ? getActivityModeDefiniton({
                      hashIdentifier: transitoryQuery.data.current.currentActivityModeHash,
                      client
                  })
                : null,
        staleTime: Infinity
    })

    const transitoryPartyMembersQuery = useQuery({
        queryKey: [
            "profileTransitoryPartyMembers",
            transitoryQuery.data?.current.currentActivityModeHash
        ],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.Transitory),
        queryFn: async () =>
            transitoryQuery.data
                ? Promise.all(
                      transitoryQuery.data.data.partyMembers.map(({ membershipId }) =>
                          getLinkedDestinyProfile({ membershipId, client })
                      )
                  )
                : null,
        staleTime: Infinity
    })

    return {
        profile:
            transitoryQuery.data && activityDefinitionQuery.data && transitoryPartyMembersQuery.data
                ? ({
                      transitory: transitoryQuery.data.data,
                      activityDefinition: activityDefinitionQuery.data,
                      activityModeDefinition: activityModeDefinitionQuery.data ?? null,
                      partyMembers: transitoryPartyMembersQuery.data
                  } satisfies TransitoryActivity)
                : null,
        lastRefresh: new Date(),
        isLoading:
            transitoryQuery.isLoading ||
            activityDefinitionQuery.isLoading ||
            activityModeDefinitionQuery.isLoading ||
            transitoryPartyMembersQuery.isLoading
    }
}
