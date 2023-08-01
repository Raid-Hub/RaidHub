import { useCallback, useEffect, useState } from "react"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { ErrorHandler } from "../../types/generic"
import { getPlayer } from "../../services/raidreport/getPlayer"
import { AllRaidReportData, RankingBannerType } from "../../types/profile"
import { RaidReportPlayer } from "../../types/raidreport"
import { Collection } from "@discordjs/collection"
import RaidReportDataCollection from "../../models/profile/data/RaidReportDataCollection"

type UseRaidReport = (params: {
    destinyMembershipIds: { destinyMembershipId: string }[] | null
    primaryMembershipId: string
    errorHandler: ErrorHandler
}) => {
    data: AllRaidReportData | null
    isLoading: boolean
}

export const useRaidReport: UseRaidReport = ({
    destinyMembershipIds,
    primaryMembershipId,
    errorHandler
}) => {
    const [data, setData] = useState<AllRaidReportData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchData = useCallback(
        async (ids: string[]) => {
            setData(null)
            setIsLoading(true)
            try {
                const promise = await Promise.allSettled(
                    ids.map(async id => [id, await getPlayer(id)] as const)
                )
                const goodPlayers = (
                    promise.filter(
                        p => p.status === "fulfilled" && p.value
                    ) as PromiseFulfilledResult<readonly [string, RaidReportPlayer]>[]
                ).map(p => p.value)

                if (!goodPlayers.length) return

                const players = new Collection(goodPlayers)
                const report = players.get(primaryMembershipId)
                if (!report) {
                    setData(null)
                    return
                }
                const _data: AllRaidReportData = {
                    rankings: [
                        {
                            type: RankingBannerType.FullClears,
                            tier: report.clearsRank.tier,
                            secondary: report.clearsRank.subtier ?? report.clearsRank.rank!,
                            value: report.clearsRank.value
                        },
                        {
                            type: RankingBannerType.Speed,
                            tier: report.speedRank.tier,
                            secondary: report.speedRank.subtier ?? report.speedRank.rank!,
                            value: report.speedRank.value
                        }
                    ],
                    activities: RaidReportDataCollection.groupActivities(
                        players.map(player => player.activities).flat()
                    )
                }
                setData(_data)
            } catch (e: any) {
                setError(e)
            } finally {
                setIsLoading(false)
            }
        },
        [primaryMembershipId]
    )

    useEffect(() => {
        error && CustomError.handle(errorHandler, error, ErrorCode.RaidReport)
    }, [error, errorHandler])

    useEffect(() => {
        if (destinyMembershipIds) {
            fetchData(destinyMembershipIds.map(obj => obj.destinyMembershipId))
        }
    }, [destinyMembershipIds, fetchData])

    return { data, isLoading }
}
