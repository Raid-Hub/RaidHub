import { type Metadata } from "next"
import { bungieProfileIconUrl } from "~/util/destiny"
import { ProfileClientWrapper } from "../../ProfileClientWrapper"
import { ProfilePage } from "../../ProfilePage"
import { generatePlayerMetadata } from "../../metadata"
import { getUniqueProfileByDestinyMembershipId, prefetchRaidHubPlayerBasic } from "../../prefetch"
import { type ProfileProps } from "../../types"

export const revalidate = 0

type PageProps = {
    params: {
        destinyMembershipId: string
    }
}

export default async function Page({ params }: PageProps) {
    // Find the app profile by id if it exists
    const [appProfile, basicProfile] = await Promise.all([
        getUniqueProfileByDestinyMembershipId(params.destinyMembershipId),
        prefetchRaidHubPlayerBasic(params.destinyMembershipId)
    ])

    const pageProps: ProfileProps = {
        ...params,
        destinyMembershipType: basicProfile?.membershipType ?? 0,
        ssrRaidHubBasic: basicProfile,
        ssrAppProfile: appProfile,
        ready: true
    }

    // Right now, I've chosen to not prefetch the Destiny profile for non
    // vanity pages, but we could do that here if we wanted to
    return (
        <ProfileClientWrapper pageProps={pageProps}>
            <ProfilePage destinyMembershipId={pageProps.destinyMembershipId} />
        </ProfileClientWrapper>
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const [profile, basic] = await Promise.all([
        getUniqueProfileByDestinyMembershipId(params.destinyMembershipId),
        prefetchRaidHubPlayerBasic(params.destinyMembershipId)
    ])

    const username = basic?.bungieGlobalDisplayName ?? basic?.displayName ?? null
    const displayName = username?.split("#")[0] ?? null

    if (!username || !displayName) {
        return {
            robots: {
                follow: true,
                index: false
            }
        }
    }

    const image = profile?.user?.image ?? bungieProfileIconUrl(basic?.iconPath)

    return generatePlayerMetadata({
        displayName,
        username,
        image
    })
}
