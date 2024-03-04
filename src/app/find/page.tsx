import { type Metadata } from "next"
import { metadata as rootMetaData } from "~/app/layout"
import { ForceClientSideBungieSignIn } from "~/components/ForceClientSideBungieSignIn"
import Find from "~/components/__deprecated__/find/find"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { getServerAuthSession } from "~/server/api/auth"

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

export const metadata: Metadata = {
    title: "Activity Finder",
    openGraph: {
        ...rootMetaData.openGraph,
        title: "Activity Finder"
    }
}
