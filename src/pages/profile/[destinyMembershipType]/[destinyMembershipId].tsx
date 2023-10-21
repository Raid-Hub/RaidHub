import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next"
import { InitialProfileProps } from "~/types/profile"
import { zUniqueDestinyProfile } from "~/util/zod"
import prisma from "~/server/prisma"
import Profile from "~/components/profile/Profile"
import {
    createServerSideQueryClient,
    createTrpcServerSideHelpers,
    prefetchDestinyProfile,
    prefetchRaidHubPlayer,
    prefetchRaidHubProfile
} from "~/server/serverQueryClient"
import { DehydratedState, Hydrate, dehydrate } from "@tanstack/react-query"

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
    dehydratedState,
    ...props
}) => {
    return (
        <Hydrate state={dehydratedState}>
            <Profile {...props} />
        </Hydrate>
    )
}

export default ProfilePage

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps<
    InitialProfileProps & { dehydratedState: DehydratedState }
> = async ({ params }) => {
    try {
        const props = zUniqueDestinyProfile.parse(params)
        const profile = await prisma.profile
            .findUnique({
                where: {
                    destinyMembershipId_destinyMembershipType: props
                },
                select: {
                    vanity: true
                }
            })
            .catch(console.error)

        if (profile?.vanity?.string) {
            return {
                redirect: {
                    permanent: true,
                    destination: `/${profile.vanity.string}`
                }
            }
        } else {
            const queryClient = createServerSideQueryClient()
            const helpers = createTrpcServerSideHelpers()
            await Promise.all([
                prefetchDestinyProfile(props, queryClient),
                prefetchRaidHubPlayer(props.destinyMembershipId, queryClient),
                prefetchRaidHubProfile(props.destinyMembershipId, helpers)
            ])

            return {
                revalidate: 3600 * 12, //12 hours
                props: {
                    ...props,
                    dehydratedState: dehydrate(queryClient),
                    trpcState: helpers.dehydrate()
                }
            }
        }
    } catch (e) {
        return { notFound: true }
    }
}
