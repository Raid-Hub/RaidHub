import { useCallback, useState } from "react"
import { useInterval } from "./useInterval"

export const useTimer = ({ startTimeMS, interval }: { startTimeMS: number; interval: number }) => {
    const [time, setTime] = useState(() => Date.now() - startTimeMS)

    const updateTime = useCallback(() => {
        setTime(Date.now() - startTimeMS)
    }, [startTimeMS])

    useInterval(interval, updateTime, {
        immediate: true
    })

    return time
}
