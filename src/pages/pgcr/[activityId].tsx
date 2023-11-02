import { z } from "zod"
import PGCR from "~/components/pgcr/PGCR"
import { useRouter } from "next/router"
import Custom404 from "../404"
import { NextPage } from "next"
import { useMemo } from "react"

const PGCRPage: NextPage = () => {
    const router = useRouter()

    const parsedQuery = useMemo(
        () => z.string().regex(/^\d+$/).optional().safeParse(router.query.activityId),
        [router.query]
    )
    if (!parsedQuery.success) {
        router.push("/")
    }
    return !parsedQuery.success ? (
        <Custom404 error={parsedQuery.error.message} />
    ) : parsedQuery.data ? (
        <PGCR activityId={parsedQuery.data} />
    ) : null
}

export default PGCRPage
