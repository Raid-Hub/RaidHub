"use client"

import { ForceClientSideBungieSignIn } from "~/components/ForceClientSideBungieSignIn"
import Find from "~/components/__deprecated__/find/find"
import { PageWrapper } from "~/components/layout/PageWrapper"

export default function Page() {
    return (
        <PageWrapper>
            <ForceClientSideBungieSignIn
                whenSignedIn={({ user }) =>
                    !!user.primaryDestinyMembershipId && (
                        <Find sessionMembershipId={user.primaryDestinyMembershipId} />
                    )
                }
            />
        </PageWrapper>
    )
}
