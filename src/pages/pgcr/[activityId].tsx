import { useState } from "react"
import { GetServerSideProps, GetStaticPropsResult, NextPage } from "next"
import ErrorComponent from "../../components/global/Error"
import CustomError from "../../models/errors/CustomError"
import PGCR from "../../components/pgcr/PGCR"
import { useRouter } from "next/router"
import Custom404 from "../404"

const PGCRPage: NextPage = () => {
    const [error, setError] = useState<CustomError | null>(null)
    const { query } = useRouter()
    const { activityId } = query

    if (error) {
        return <ErrorComponent error={error} />
    } else if (Array.isArray(activityId)) {
        return <Custom404 error={"Invalid activityId: " + JSON.stringify(activityId)} />
    } else {
        return <PGCR activityId={activityId} errorHandler={setError} />
    }
}
export default PGCRPage
