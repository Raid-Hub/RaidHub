import { useState } from "react"
import { GetServerSideProps, NextPage } from "next"
import ErrorComponent from "../../components/global/Error"
import CustomError from "../../models/errors/CustomError"
import PGCR from "../../components/pgcr/PGCR"
import Custom404 from "../404"

type ActivityProps = { activityId: string }

const PGCRPage: NextPage<ActivityProps> = ({ activityId }) => {
    const [error, setError] = useState<CustomError | null>(null)

    if (error) {
        return <ErrorComponent error={error} />
    } else if (Array.isArray(activityId)) {
        return <Custom404 error={"Invalid activityId: " + JSON.stringify(activityId)} />
    } else {
        return <PGCR activityId={activityId} errorHandler={setError} />
    }
}
export default PGCRPage

export const getServerSideProps: GetServerSideProps<ActivityProps, ActivityProps> = async ({
    params
}) => {
    if (params?.activityId) {
        return {
            props: {
                activityId: params.activityId
            }
        }
    } else {
        return { notFound: true }
    }
}
