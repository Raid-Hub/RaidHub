import { type BungieMembershipType } from "bungie-net-core/models"
import { type Metadata } from "next"
import { RedirectType, permanentRedirect } from "next/navigation"
import { ProfileClientWrapper } from "~/app/(profile)/ProfileClientWrapper"
import { ProfilePage } from "~/app/(profile)/ProfilePage"
import { type ProfileProps } from "~/app/(profile)/types"
import { metadata as rootMetaData } from "~/app/layout"
import { trpcServer } from "~/server/api/trpc/client"

type PageProps = {
    params: {
        destinyMembershipId: string
        destinyMembershipType: BungieMembershipType
    }
}

export default async function Page({ params }: PageProps) {
    // Find the app profile by id if it exists
    const appProfile = await trpcServer.profile.getUnique.query({
        destinyMembershipId: params.destinyMembershipId
    })
    if (appProfile?.vanity) {
        permanentRedirect(`/${appProfile.vanity}`, RedirectType.replace)
    }

    const pageProps: ProfileProps = {
        ...params,
        ssrAppProfile: appProfile ?? null,
        ready: true
    }

    // Right now, I've chosen to not prefetch the Destiny profile for non
    // vanity pages, but we could do that here if we wanted to
    return (
        <ProfileClientWrapper pageProps={pageProps}>
            <ProfilePage />
        </ProfileClientWrapper>
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const username = await trpcServer.profile.getUnique
        .query({
            destinyMembershipId: params.destinyMembershipId
        })
        .then(profile => profile?.name)
        .catch(() => null)

    if (!username) {
        return {}
    }

    const description = `View ${username}'s raid stats, achievements, tags, and more`
    return {
        title: username,
        description,
        openGraph: {
            ...rootMetaData.openGraph,
            title: username,
            description
        }
    }
}
