import ProfileWrapper from "../components/profile/ProfileWrapper"
import { InitialProfileProps } from "../types/profile"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import prisma from "../server/prisma"
import { z } from "zod"
import { reactQueryClient } from "../util/reactQueryClient"

const ProfileVanityPage: NextPage<InitialProfileProps> = props => {
    return <ProfileWrapper {...props} />
}

export const getStaticPaths: GetStaticPaths<{ vanity: string }> = async () => {
    const vanities = await prisma.vanity.findMany({
        where: {
            NOT: {
                userId: null
            }
        }
    })

    return {
        paths:
            process.env.APP_ENV !== "local"
                ? vanities.map(v => ({
                      params: {
                          vanity: v.string
                      }
                  }))
                : [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps<InitialProfileProps, { vanity: string }> = async ({
    params
}) => {
    try {
        const vanityString = z.string().parse(params?.vanity)
        const getVanity = async (string: string) =>
            prisma.vanity.findUnique({
                where: {
                    string
                },
                select: {
                    destinyMembershipId: true,
                    destinyMembershipType: true
                }
            })

        const details = await reactQueryClient.fetchQuery(
            [vanityString],
            () => getVanity(vanityString),
            {
                staleTime: 5 * 60000
            }
        )

        if (details?.destinyMembershipId && details.destinyMembershipType) {
            return { props: details, revalidate: 24 * 60 * 60 }
        }
    } catch {}
    return { notFound: true, revalidate: 20 * 60 }
}

export default ProfileVanityPage
