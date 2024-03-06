import { type BungieMembershipType } from "bungie-net-core/models"
import { type Metadata } from "next"
import { RedirectType, permanentRedirect } from "next/navigation"
import { ProfileClientWrapper } from "~/app/(profile)/ProfileClientWrapper"
import { ProfilePage } from "~/app/(profile)/ProfilePage"
import { generatePlayerMetadata } from "~/app/(profile)/metadata"
import {
    getUniqueProfileByDestinyMembershipId,
    prefetchRaidHubPlayerBasic
} from "~/app/(profile)/prefetch"
import { type ProfileProps } from "~/app/(profile)/types"
import { bungieProfileIconUrl } from "~/util/destiny"

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
    const appProfile = await getUniqueProfileByDestinyMembershipId(params.destinyMembershipId)
    if (appProfile?.vanity) {
        permanentRedirect(`/${appProfile.vanity}`, RedirectType.replace)
    }

    const basicProfile = await prefetchRaidHubPlayerBasic({
        membershipId: params.destinyMembershipId
    }).catch(() => null)

    const pageProps: ProfileProps = {
        ...params,
        ssrRaidHubBasic: basicProfile,
        ssrAppProfile: appProfile,
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
    const [profile, basic] = await Promise.all([
        getUniqueProfileByDestinyMembershipId(params.destinyMembershipId).catch(() => null),
        prefetchRaidHubPlayerBasic({
            membershipId: params.destinyMembershipId
        }).catch(() => null)
    ])

    if (!profile && !basic) {
        return {}
    }

    const username = profile?.name ?? basic?.bungieGlobalDisplayName ?? basic?.displayName ?? null

    if (!username) {
        return {}
    }

    const image = profile?.image ?? bungieProfileIconUrl(basic?.iconPath)

    return generatePlayerMetadata({
        username,
        image
    })
}
