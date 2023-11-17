import { NextPage } from "next"
import Find from "~/components/find/find"
import { useSearchParams } from "~/hooks/util/useSearchParams"
import { activitySearchQuerySchema } from "~/services/raidhub/activitySearch"

const FindPage: NextPage = () => {
    const { isReady, query, searchString, append, remove } = useSearchParams({
        decoder: q => activitySearchQuerySchema.parse(q)
    })

    return (
        <main>
            {isReady && (
                <Find
                    query={query}
                    appendToQuery={append}
                    removeFromQuery={remove}
                    searchString={searchString}
                />
            )}
        </main>
    )
}

export default FindPage
