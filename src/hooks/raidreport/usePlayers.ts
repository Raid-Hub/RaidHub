import { useCallback, useEffect, useState } from "react"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { ErrorHandler } from "../../types/generic"
import { mergeActivities } from "../../util/raidreport/mergeActivitiesArray"
import { getPlayer } from "../../services/raidreport/getPlayer"
import { AllRaidReportData } from "../../types/profile"
import { RankingBannerType } from "../../components/profile/Banners"
import { RaidReportPlayer } from "../../types/raidreport"

type UsePlayers = (params: {
    destinyMembershipIds: { destinyMembershipId: string }[] | null
    primaryMembershipId: string
    errorHandler: ErrorHandler
}) => {
    player: AllRaidReportData | null
    isLoading: boolean
}

export const usePlayers: UsePlayers = ({
    destinyMembershipIds,
    primaryMembershipId,
    errorHandler
}) => {
    const [player, setPlayer] = useState<AllRaidReportData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = useCallback(
        async (ids: string[]) => {
            setPlayer(null)
            try {
                const promise = await Promise.allSettled(
                    ids.map(async id => [id, await getPlayer(id)] as const)
                )
                const goodPlayers = (
                    promise.filter(
                        p => p.status === "fulfilled" && p.value
                    ) as PromiseFulfilledResult<readonly [string, RaidReportPlayer]>[]
                ).map(p => p.value)

                const players = new Map(goodPlayers)
                const { clearsRank, speedRank } = players.get(primaryMembershipId)!
                players.get(primaryMembershipId)
                const _player: AllRaidReportData = {
                    clearsRank: {
                        type: RankingBannerType.FullClears,
                        tier: clearsRank.tier,
                        secondary: clearsRank.subtier ?? clearsRank.rank!,
                        value: clearsRank.value
                    },
                    speedRank: {
                        type: RankingBannerType.Speed,
                        tier: speedRank.tier,
                        secondary: speedRank.subtier ?? speedRank.rank!,
                        value: speedRank.value
                    },
                    activities: mergeActivities(
                        Array.from(players.values()).flatMap(player => player.activities)
                    )
                }
                setPlayer(_player)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.RaidReport)
            } finally {
                setIsLoading(false)
            }
        },
        [primaryMembershipId, errorHandler]
    )

    useEffect(() => {
        setIsLoading(true)

        if (destinyMembershipIds) {
            fetchData(destinyMembershipIds.map(obj => obj.destinyMembershipId))
        }
        setIsLoading(false)
    }, [destinyMembershipIds, fetchData])

    return { player, isLoading }
}
