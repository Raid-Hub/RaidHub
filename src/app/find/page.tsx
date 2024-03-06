"use client"

import { ForceClientSideBungieSignIn } from "~/components/ForceClientSideBungieSignIn"
import Find from "~/components/__deprecated__/find/find"
import { PageWrapper } from "~/components/layout/PageWrapper"

export default function Page() {
    return (
        <PageWrapper>
            <ForceClientSideBungieSignIn
                whenSignedIn={({ user }) => <Find sessionMembershipId={user.destinyMembershipId} />}
            />
        </PageWrapper>
    )
}
