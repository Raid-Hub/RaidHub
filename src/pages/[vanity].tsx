import ProfileWrapper from "../components/profile/ProfileWrapper"
import { InitialProfileProps, VanityCookie } from "../types/profile"
import { GetServerSideProps, NextPage } from "next"
import prisma from "../util/server/prisma"
import Cookies from "cookies"
import { zUniqueDestinyProfile } from "../util/server/zod"
import { z } from "zod"
import reactQueryClient from "../services/reactQueryClient"

const ProfileVanityPage: NextPage<InitialProfileProps> = props => {
    return <ProfileWrapper {...props} />
}

export const getServerSideProps: GetServerSideProps<
    InitialProfileProps,
    { vanity: string }
> = async ({ params, res, req }) => {
    try {
        const parsedVanityCookie = zUniqueDestinyProfile.safeParse(req.cookies.vanity)
        if (parsedVanityCookie.success) {
            const cookies = new Cookies(req, res)
            cookies.set("vanity")
            return { props: parsedVanityCookie.data }
        } else {
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
                return { props: details }
            }
        }
    } catch (e) {
        console.error(e)
    }
    return { notFound: true }
}

export default ProfileVanityPage
