import { type BungieMembershipType } from "bungie-net-core/models"
import { type Metadata } from "next"
import { RedirectType, permanentRedirect } from "next/navigation"
import { ProfileClientWrapper } from "~/app/(profile)/ProfileClientWrapper"
import { ProfilePage } from "~/app/(profile)/ProfilePage"
import { getUniqueProfile } from "~/app/(profile)/prefetch"
import { type ProfileProps } from "~/app/(profile)/types"
import { metadata as rootMetaData } from "~/app/layout"

type PageProps = {
    params: {
        destinyMembershipId: string
        destinyMembershipType: BungieMembershipType
    }
}

export const dynamic = "force-static"
export const dynamicParams = true
export const revalidate = 900

export default async function Page({ params }: PageProps) {
    // Find the app profile by id if it exists
    const appProfile = await getUniqueProfile({
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
    const username = await getUniqueProfile({
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
