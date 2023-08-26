import { createContext, useContext, useState } from "react"
import { GetStaticProps, NextPage } from "next"
import CustomError from "../../models/errors/CustomError"
import { z } from "zod"
import { usePGCR } from "../../hooks/bungie/usePGCR"
import DestinyPGCR from "../../models/pgcr/PGCR"
import ErrorComponent from "../../components/global/Error"
import PGCR from "../../components/pgcr/PGCR"
import { Loading } from "../../types/generic"

const PgcrContext = createContext<{ pgcr: DestinyPGCR | null | undefined; loadingState: Loading }>({
    pgcr: undefined,
    loadingState: Loading.LOADING
})

export const usePGCRContext = () => useContext(PgcrContext)

type PGCRPageProps = {
    activityId: string
}
const PGCRPage: NextPage<PGCRPageProps> = ({ activityId }) => {
    const [error, setError] = useState<CustomError | null>(null)
    const { data: pgcr, loadingState } = usePGCR({ activityId, errorHandler: setError })

    return (
        <PgcrContext.Provider value={{ pgcr, loadingState }}>
            {error ? <ErrorComponent error={error} /> : <PGCR />}
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
