import { type Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { metadata as rootMetaData } from "~/app/layout"
import { trpcServer } from "~/server/api/trpc/client"
import { type AppProfile } from "~/types/api"
import { ProfileClientWrapper } from "../ProfileClientWrapper"
import { ProfilePage } from "../ProfilePage"
import { getDestinyProfile, getRaidHubPlayerProfile } from "../prefetch"
import { type ProfileProps } from "../types"

type PageProps = {
    params: {
        vanity: string
    }
}

export default async function Page({ params }: PageProps) {
    const redirectFrom = headers()
        .get("next-url")
        ?.match(/\/profile\/(\d+)\/(\d+)/)

    if (redirectFrom) {
        const appProfile = await trpcServer.profile.getUnique.query({
            destinyMembershipId: redirectFrom[2]
        })

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
    const appProfile = await trpcServer.profile.getUnique.query(params).then(p => p ?? notFound())

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
                    <ProfilePage />
                </ProfileClientWrapper>
            }>
            <HydratedVanityPage {...appProfile} />
        </Suspense>
    )
}

const HydratedVanityPage = async (appProfile: NonNullable<AppProfile>) => {
    const [raidHubProfile, destinyProfile] = await Promise.all([
        getRaidHubPlayerProfile({ membershipId: appProfile.destinyMembershipId }).catch(() => null),
        getDestinyProfile({
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
    const username = await trpcServer.profile.getUnique
        .query(params)
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
