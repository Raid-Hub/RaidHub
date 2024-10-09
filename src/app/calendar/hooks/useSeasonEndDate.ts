import { useMemo } from "react"
import { useSeasons } from "~/hooks/dexie"

export const useSeasonEndDate = () => {
    const seasons = useSeasons()

    return useMemo(() => {
        const endDateStr = seasons?.findLast(
            season => new Date(season.startDate!) < new Date()
        )?.endDate

        if (!endDateStr) return null
        return new Date(endDateStr)
    }, [seasons])
}
