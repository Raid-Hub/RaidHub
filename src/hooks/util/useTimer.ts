import { useMemo, useState } from "react"
import { useInterval } from "./useInterval"

export const useTimer = ({ since, interval = 1000 }: { since: Date; interval?: number }) => {
    const origin = useMemo(() => since.getTime(), [since])
    const [time, setTime] = useState(() => Date.now() - origin)

    useInterval(interval, () => setTime(Date.now() - origin))

    return time
}
