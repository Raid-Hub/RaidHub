import { InitialProfileProps } from "~/types/profile"
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next"
import prisma from "~/server/prisma"
import { z } from "zod"
import Profile from "~/components/profile/Profile"
import {
    createServerSideQueryClient,
    createTrpcServerSideHelpers,
    prefetchDestinyProfile,
    prefetchRaidHubPlayer,
    prefetchRaidHubProfile
} from "~/server/serverQueryClient"
import { DehydratedState, Hydrate, dehydrate } from "@tanstack/react-query"
import Head from "next/head"

const ProfileVanityPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = props => {
    return (
        <Hydrate state={props.dehydratedState}>
            <Head>
                <link rel="canonical" />
            </Head>
            <Profile {...props} />
        </Hydrate>
    )
}

export const getStaticPaths: GetStaticPaths<{ vanity: string }> = async () => {
    const vanities = await prisma.profile.findMany({
        where: {
            NOT: {
                vanity: null
            }
        },
        select: {
            vanity: true
        }
    })

    return {
        paths:
            process.env.APP_ENV !== "local"
                ? vanities.map(({ vanity }) => ({
                      params: {
                          vanity: vanity!
                      }
                  }))
                : [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps<
    InitialProfileProps & { dehydratedState: DehydratedState },
    { vanity: string }
> = async ({ params }) => {
    try {
        const vanityString = z.string().parse(params?.vanity)
        const getVanity = async (string: string) =>
            prisma.profile.findUnique({
                where: {
                    vanity: string
                },
                select: {
                    destinyMembershipId: true,
                    destinyMembershipType: true
                }
            })

        const vanity = await getVanity(vanityString.toLowerCase())

        if (vanity?.destinyMembershipId && vanity.destinyMembershipType) {
            const queryClient = createServerSideQueryClient()
            const helpers = createTrpcServerSideHelpers()
            await Promise.all([
                prefetchDestinyProfile(vanity, queryClient),
                prefetchRaidHubPlayer(vanity.destinyMembershipId, queryClient),
                prefetchRaidHubProfile(vanity.destinyMembershipId, helpers)
            ])

            return {
                props: {
                    ...vanity,
                    trpcState: helpers.dehydrate(),
                    dehydratedState: dehydrate(queryClient)
                },
                revalidate: 24 * 3600
            }
        }
    } catch (e) {
        console.error(e)
    }
    return { notFound: true, revalidate: 24 * 3600 }
}

export default ProfileVanityPage
