import { useRouter } from "next/router"
import { useCallback, useMemo } from "react"

export const usePage = (): [page: number, setPage: (page: number) => void] => {
    const router = useRouter()
    const page = useMemo(() => {
        const queryPage = router.query.page
        if (typeof queryPage === "string") {
            const val = Number(queryPage)
            return !isNaN(val) && val >= 0 ? val : 0
        } else {
            return 0
        }
    }, [router.query])
    const setPage = useCallback(
        (page: number) => {
            router.push(
                {
                    query: {
                        ...router.query,
                        page
                    }
                },
                undefined,
                {
                    shallow: true
                }
            )
        },
        [router]
    )

    return [page, setPage]
}
