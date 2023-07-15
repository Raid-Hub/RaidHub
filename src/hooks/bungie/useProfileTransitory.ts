import {
    BungieMembershipType,
    DestinyActivityDefinition,
    DestinyActivityModeDefinition,
    DestinyProfileTransitoryComponent,
    DestinyProfileUserInfoCard
} from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../types/generic"
import { useCallback, useEffect, useState } from "react"
import { useBungieClient } from "../../components/app/TokenManager"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { getProfileTransitory } from "../../services/bungie/getProfileTransitory"
import {
    getActivityDefiniton,
    getActivityModeDefiniton
} from "../../services/bungie/getActivityDefinition"
import { getLinkedDestinyProfile } from "../../services/bungie/getLinkedDestinyProfile"

type UseProfileTransitoryParams = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

export type TransitoryActivity = {
    transitory: DestinyProfileTransitoryComponent
    activityDefinition: DestinyActivityDefinition
    activityModeDefinition: DestinyActivityModeDefinition
    partyMembers: DestinyProfileUserInfoCard[]
}

type UseProfileTransitory = {
    profile: TransitoryActivity | null
    lastRefresh: Date
    isLoading: boolean
}

const REFRESH_INTERVAL = 60 * 1000

export const useProfileTransitory = ({
    destinyMembershipId,
    membershipType,
    errorHandler
}: UseProfileTransitoryParams): UseProfileTransitory => {
    const [profile, setProfile] = useState<TransitoryActivity | null>(null)
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
    const [isLoading, setLoading] = useState<boolean>(true)
    const [timer, setTimer] = useState<NodeJS.Timeout>()
    const [needsRefresh, setNeedsRefresh] = useState<boolean>(false)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (
            destinyMembershipId: string,
            membershipType: BungieMembershipType,
            cached: TransitoryActivity | null
        ) => {
            try {
                setNeedsRefresh(false)
                const transitory = await getProfileTransitory({
                    destinyMembershipId,
                    membershipType,
                    client
                })
                if (!transitory) {
                    setProfile(null)
                } else if (
                    transitory.data.currentActivity.startTime !==
                    cached?.transitory.currentActivity.startTime
                ) {
                    const [activityDefinition, activityModeDefinition, partyMembers] =
                        await Promise.all([
                            getActivityDefiniton({
                                hashIdentifier: transitory.current.currentActivityHash,
                                client
                            }),
                            getActivityModeDefiniton({
                                hashIdentifier: transitory.current.currentActivityModeHash,
                                client
                            }),
                            Promise.all(
                                transitory.data.partyMembers
                                    .filter(member => member.membershipId == destinyMembershipId)
                                    .map(({ membershipId }) =>
                                        getLinkedDestinyProfile({ membershipId, client })
                                    )
                            )
                        ])
                    setProfile({
                        transitory: transitory.data,
                        activityDefinition,
                        activityModeDefinition,
                        partyMembers
                    })
                }
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.Transitory)
            } finally {
                setLastRefresh(new Date())
                setLoading(false)
                const timeout = setTimeout(() => {
                    setNeedsRefresh(true)
                }, REFRESH_INTERVAL)
                setTimer(timeout)
            }
        },
        [client, errorHandler, setTimer]
    )

    useEffect(() => {
        if (needsRefresh) {
            fetchData(destinyMembershipId, membershipType, profile)
        }
    }, [needsRefresh, fetchData, profile])

    useEffect(() => {
        setLoading(true)
        fetchData(destinyMembershipId, membershipType, null)

        return () => {
            clearTimeout(timer)
        }
    }, [destinyMembershipId, membershipType, fetchData])
    return { profile, isLoading, lastRefresh }
}
