import { createContext, useContext } from "react"
import { GetStaticProps, NextPage } from "next"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { z } from "zod"
import DestinyPGCR from "../../models/pgcr/PGCR"
import ErrorComponent from "../../components/global/Error"
import PGCR from "../../components/pgcr/PGCR"
import { useBungieClient } from "~/components/app/TokenManager"
import { QueryObserverLoadingResult, QueryObserverSuccessResult } from "@tanstack/react-query"

const PgcrContext = createContext<
    QueryObserverSuccessResult<DestinyPGCR> | QueryObserverLoadingResult<DestinyPGCR> | null
>(null)

export const usePGCRContext = () => {
    const ctx = useContext(PgcrContext)
    if (!ctx) throw new Error("Cannot access pgcr out of context")
    return ctx
}

type PGCRPageProps = {
    activityId: string
}
const PGCRPage: NextPage<PGCRPageProps> = ({ activityId }) => {
    const bungie = useBungieClient()
    const query = bungie.pgcr.useQuery({ activityId }, { staleTime: Infinity })

    return query.isError ? (
        <ErrorComponent error={CustomError.handle(query.error, ErrorCode.PGCR)} />
    ) : (
        <PgcrContext.Provider value={query}>
            <PGCR />
        </PgcrContext.Provider>
    )
}

export default PGCRPage

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps<PGCRPageProps> = async ({ params }) => {
    try {
        const props = z
            .object({
                activityId: z.string().regex(/^\d+$/)
            })
            .parse(params)
        return {
            props
        }
    } catch {
        return { notFound: true }
    }
}
