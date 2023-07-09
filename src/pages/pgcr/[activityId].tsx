import { useState } from "react"
import { GetStaticPropsResult, NextPage } from "next"
import ErrorComponent from "../../components/global/Error"
import CustomError from "../../models/errors/CustomError"
import PGCR from "../../components/pgcr/PGCR"

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

export async function getServerSideProps({
    params
}: {
    params: { activityId: string }
}): Promise<GetStaticPropsResult<PGCRPageProps>> {
    const activityId = params.activityId
    return { props: { activityId } }
}

export default PGCRPage
