import { NextPage } from "next"
import { signIn, useSession } from "next-auth/react"
import Find from "~/components/find/find"
import { useSearchParams } from "~/hooks/util/useSearchParams"
import { activitySearchQuerySchema } from "~/services/raidhub/activitySearch"

const FindPage: NextPage = () => {
    const { status, data: sessionData } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("bungie", undefined, "reauth=false")
        }
    })

    const { isReady, query, replaceAll } = useSearchParams({
        decoder: q => activitySearchQuerySchema.parse(q)
    })

    return isReady && status === "authenticated" ? (
        <Find
            query={query}
            replaceAllQueryParams={replaceAll}
            sessionMembershipId={sessionData.user.destinyMembershipId}
        />
    ) : null
}

export default FindPage
