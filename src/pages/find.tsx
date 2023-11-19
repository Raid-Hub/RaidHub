import { NextPage } from "next"
import Find from "~/components/find/find"
import { useSearchParams } from "~/hooks/util/useSearchParams"
import { activitySearchQuerySchema } from "~/services/raidhub/activitySearch"

const FindPage: NextPage = () => {
    const { isReady, query, replaceAll } = useSearchParams({
        decoder: q => activitySearchQuerySchema.parse(q)
    })

    return isReady ? <Find query={query} replaceAllQueryParams={replaceAll} /> : null
}

export default FindPage
