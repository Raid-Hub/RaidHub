import { NextPage } from "next"
import Find from "~/components/find/Find"
import { useSearchParams } from "~/hooks/util/useSearchParams"
import { activitySearchQuerySchema } from "~/services/raidhub/activitySearch"

const FindPage: NextPage = () => {
    const { isReady, query, searchString, append, remove, set } = useSearchParams({
        decoder: q => activitySearchQuerySchema.parse(q)
    })

    return isReady ? (
        <Find
            query={query}
            appendToQuery={append}
            removeFromQuery={remove}
            setQueryKey={set}
            searchString={searchString}
        />
    ) : null
}

export default FindPage
