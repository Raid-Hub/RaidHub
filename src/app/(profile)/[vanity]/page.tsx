import { type Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { type AppProfile } from "~/types/api"
import { bungieProfileIconUrl } from "~/util/destiny"
import { ProfileClientWrapper } from "../ProfileClientWrapper"
import { ProfilePage } from "../ProfilePage"
import { generatePlayerMetadata } from "../metadata"
import {
    getUniqueProfileByDestinyMembershipId,
    getUniqueProfileByVanity,
    prefetchDestinyProfile,
    prefetchRaidHubPlayerProfile
} from "../prefetch"
import { type ProfileProps } from "../types"

type PageProps = {
    params: {
        vanity: string
    }
}

export const dynamic = "force-dynamic"
export const dynamicParams = true

export default async function Page({ params }: PageProps) {
    const redirectFrom = headers()
        .get("next-url")
        ?.match(/\/profile\/(\d+)\/(\d+)/)

    if (redirectFrom) {
        const appProfile = await getUniqueProfileByDestinyMembershipId(redirectFrom[2])

        const pageProps: ProfileProps = {
            destinyMembershipId: redirectFrom[2],
            destinyMembershipType: Number(redirectFrom[1]),
            ssrAppProfile: appProfile,
            ready: true
        }
        return (
            <ProfileClientWrapper pageProps={pageProps}>
                <ProfilePage />
            </ProfileClientWrapper>
        )
    }

    // Find the app profile by vanity, and if it doesn't exist next will render a 404
    const appProfile = await getUniqueProfileByVanity(params.vanity).then(p => p ?? notFound())

    return (
        <Suspense
            key={params.vanity}
            fallback={
                <ProfileClientWrapper
                    pageProps={{
                        ssrAppProfile: appProfile,
                        destinyMembershipId: appProfile.destinyMembershipId,
                        destinyMembershipType: appProfile.destinyMembershipType,
                        ready: false
                    }}>
                    <ProfilePage />
                </ProfileClientWrapper>
            }>
            <HydratedVanityPage {...appProfile} />
        </Suspense>
    )
}

const HydratedVanityPage = async (appProfile: NonNullable<AppProfile>) => {
    const [raidHubProfile, destinyProfile] = await Promise.all([
        prefetchRaidHubPlayerProfile({ membershipId: appProfile.destinyMembershipId }).catch(
            () => null
        ),
        prefetchDestinyProfile({
            destinyMembershipId: appProfile.destinyMembershipId,
            membershipType: appProfile.destinyMembershipType
        }).catch(() => null)
    ])

    const pageProps: ProfileProps = {
        destinyMembershipId: appProfile.destinyMembershipId,
        destinyMembershipType: appProfile.destinyMembershipType,
        ssrAppProfile: appProfile,
        ssrRaidHubProfile: raidHubProfile,
        ssrDestinyProfile: destinyProfile,
        ready: true
    }
    return (
        <ProfileClientWrapper pageProps={pageProps}>
            <ProfilePage />
        </ProfileClientWrapper>
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const profile = await getUniqueProfileByVanity(params.vanity).catch(() => null)

    if (profile?.name === undefined) {
        return {}
    }

    const raidhub = await prefetchRaidHubPlayerProfile({
        membershipId: profile.destinyMembershipId
    }).catch(() => null)

    const image = profile?.image ?? bungieProfileIconUrl(raidhub?.player.iconPath)

    return generatePlayerMetadata({
        username: profile.name,
        image
    })
}
