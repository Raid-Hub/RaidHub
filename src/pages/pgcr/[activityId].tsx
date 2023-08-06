import { useState } from "react"
import { GetServerSideProps, NextPage } from "next"
import ErrorComponent from "../../components/global/Error"
import CustomError from "../../models/errors/CustomError"
import PGCR from "../../components/pgcr/PGCR"
import { z } from "zod"

type PGCRPageProps = {
    activityId: string
}
const PGCRPage: NextPage<PGCRPageProps> = ({ activityId }) => {
    const [error, setError] = useState<CustomError | null>(null)

    if (error) {
        return <ErrorComponent error={error} />
    } else {
        return <PGCR activityId={activityId} errorHandler={setError} />
    }
}

export default PGCRPage

export const getServerSideProps: GetServerSideProps<PGCRPageProps> = async ({ params }) => {
    try {
        const props = z
            .object({
                activityId: z.string()
            })
            .parse(params)
        return {
            props
        }
    } catch {
        return { notFound: true }
    }
}
