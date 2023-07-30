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
    destinyMembershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

export type TransitoryActivity = {
    transitory: DestinyProfileTransitoryComponent
    activityDefinition: DestinyActivityDefinition
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
}: UseProfileTransitoryParams): UseProfileTransitory => {
    const [profile, setProfile] = useState<TransitoryActivity | null>(null)
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
    const [isLoading, setLoading] = useState<boolean>(true)
    const [timer, setTimer] = useState<NodeJS.Timeout>()
    const [needsRefresh, setNeedsRefresh] = useState<boolean>(true)
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
                } else {
                    const [activityDefinition, activityModeDefinition, partyMembers] =
                        await Promise.all([
                            transitory.current.currentActivityHash !==
                            cached?.activityDefinition.hash
                                ? getActivityDefiniton({
                                      hashIdentifier: transitory.current.currentActivityHash,
                                      client
                                  })
                                : cached.activityDefinition,

                            transitory.current.currentActivityModeHash !==
                                cached?.activityModeDefinition?.hash &&
                            cached?.activityModeDefinition !== null
                                ? getActivityModeDefiniton({
                                      hashIdentifier: transitory.current.currentActivityModeHash,
                                      client
                                  })
                                : cached.activityModeDefinition,

                            Promise.all(
                                transitory.data.partyMembers.map(
                                    ({ membershipId }) =>
                                        cached?.partyMembers.find(
                                            pm => pm.membershipId === membershipId
                                        ) ?? getLinkedDestinyProfile({ membershipId, client })
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
            setLoading(true)
            fetchData(destinyMembershipId, destinyMembershipType, profile)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [destinyMembershipId, destinyMembershipType, fetchData, timer, needsRefresh, profile])

    return { profile, isLoading, lastRefresh }
}
