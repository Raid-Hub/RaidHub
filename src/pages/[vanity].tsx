import { InitialProfileProps } from "~/types/profile"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import prisma from "~/server/prisma"
import { z } from "zod"
import Profile from "~/components/profile/Profile"

const ProfileVanityPage: NextPage<InitialProfileProps> = props => {
    return <Profile {...props} />
}

export const getStaticPaths: GetStaticPaths<{ vanity: string }> = async () => {
    const vanities = await prisma.vanity.findMany({
        where: {
            NOT: {
                profileId: null
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

        const details = await getVanity(vanityString)

        if (details?.destinyMembershipId && details.destinyMembershipType) {
            return { props: details, revalidate: 24 * 3600 }
        }
    } catch (e) {
        console.error(e)
    }
    return { notFound: true, revalidate: 24 * 3600 }
}

export default ProfileVanityPage
