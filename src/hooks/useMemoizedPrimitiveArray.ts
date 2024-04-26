import { useMemo } from "react"

export const useMemoizedPrimitiveArray = <
    T extends (number | string | boolean | undefined | null)[]
>(
    arr: T
): T => {
    // hashes the contents of the array
    const hash = arr.join("%<@[!$?.>*")

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => arr, [hash])
}
