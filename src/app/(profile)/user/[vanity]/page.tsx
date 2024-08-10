import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { type AppProfile } from "~/types/api"
import { bungieProfileIconUrl } from "~/util/destiny"
import { ProfileClientWrapper } from "../../ProfileClientWrapper"
import { ProfilePage } from "../../ProfilePage"
import { generatePlayerMetadata } from "../../metadata"
import { getUniqueProfileByVanity, prefetchRaidHubPlayerProfile } from "../../prefetch"
import { type ProfileProps } from "../../types"

type PageProps = {
    params: {
        vanity: string
    }
}

export const dynamicParams = true
export const revalidate = 900

/**
 * This page preferably should be accessed at /:vanity through rewrites in next.config.js
 */
export default async function Page({ params }: PageProps) {
    // Find the app profile by vanity, and if it doesn't exist next will render a 404
    const appProfile = await getUniqueProfileByVanity(params.vanity).then(p => p ?? notFound())

    return (
        <Suspense
            fallback={
                <ProfileClientWrapper
                    pageProps={{
                        ssrAppProfile: appProfile,
                        destinyMembershipId: appProfile.destinyMembershipId,
                        destinyMembershipType: appProfile.destinyMembershipType,
                        ready: false
                    }}>
                    <ProfilePage destinyMembershipId={appProfile.destinyMembershipId} />
                </ProfileClientWrapper>
            }>
            <HydratedVanityPage {...appProfile} />
        </Suspense>
    )
}

// todo: maybe not prefer the d2 profile, slowww
const HydratedVanityPage = async (appProfile: NonNullable<AppProfile>) => {
    const raidHubProfile = await prefetchRaidHubPlayerProfile(appProfile.destinyMembershipId)

    const pageProps: ProfileProps = {
        destinyMembershipId: appProfile.destinyMembershipId,
        destinyMembershipType: appProfile.destinyMembershipType,
        ssrAppProfile: appProfile,
        ssrRaidHubProfile: raidHubProfile,
        ready: true
    }
    return (
        <ProfileClientWrapper pageProps={pageProps}>
            <ProfilePage destinyMembershipId={pageProps.destinyMembershipId} />
        </ProfileClientWrapper>
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const profile = await getUniqueProfileByVanity(params.vanity)

    const profileUsername = profile?.user.name
    if (!profileUsername) {
        return {
            robots: {
                follow: false,
                index: false
            }
        }
    }

    const raidhub = await prefetchRaidHubPlayerProfile(profile.destinyMembershipId)

    const image = profile.user.image ?? bungieProfileIconUrl(raidhub?.playerInfo.iconPath)

    return generatePlayerMetadata({
        username: profileUsername,
        image
    })
}
