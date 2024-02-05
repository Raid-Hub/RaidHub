import { useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"

export const usePage = (keep?: readonly string[]) => {
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
            const necessaryQueryParams = new Set<string>([
                ...router.pathname
                    .split("/")
                    .map(s => s.match(/\[([^[\]]+)]/)?.[0].substring(1, s.length - 1))
                    .filter((s): s is string => !!s),
                ...(keep ?? [])
            ])

            const keepers = Object.fromEntries(
                Object.entries(router.query).filter(([key, _]) => necessaryQueryParams.has(key))
            )

            router.push(
                {
                    query: {
                        ...keepers,
                        page
                    }
                },
                undefined,
                {
                    shallow: true
                }
            )
        },
        [router, keep]
    )

    const handleForwards = () => {
        setPage(page + 1)
    }

    const handleBackwards = () => {
        setPage(page > 1 ? page - 1 : page)
    }

    return { page, handleForwards, handleBackwards, setPage }
}
