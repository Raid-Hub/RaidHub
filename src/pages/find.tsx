import { NextPage } from "next"
import { signIn, useSession } from "next-auth/react"
import Find from "~/components/find/find"

const FindPage: NextPage = () => {
    const { status, data: sessionData } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("bungie", undefined, "reauth=false")
        }
    })

    return status === "authenticated" ? (
        <Find sessionMembershipId={sessionData.user.destinyMembershipId} />
    ) : null
}

export default FindPage
