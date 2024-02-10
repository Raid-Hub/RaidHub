import Find from "components_old/find/find"
import { ForceClientSideBungieSignIn } from "~/components/ForceClientSideBungieSignIn"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { getServerAuthSession } from "../api/auth"

export default async function Page() {
    const session = await getServerAuthSession()

    return (
        <PageWrapper>
            {session ? (
                <Find sessionMembershipId={session.user.destinyMembershipId} />
            ) : (
                <ForceClientSideBungieSignIn />
            )}
        </PageWrapper>
    )
}
