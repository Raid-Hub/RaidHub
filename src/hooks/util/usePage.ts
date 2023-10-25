import { useRouter } from "next/router"
import { useCallback, useMemo } from "react"

export const usePage = () => {
    const router = useRouter()
    const page = useMemo(() => {
        const queryPage = router.query.page
        if (typeof queryPage === "string") {
            const val = Number(queryPage)
            return !isNaN(val) && val >= 1 ? val : 1
        } else {
            return 1
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

    const handleForwards = () => {
        setPage(page + 1)
    }

    const handleBackwards = () => {
        setPage(page > 1 ? page - 1 : page)
    }

    return { page, handleForwards, handleBackwards }
}
