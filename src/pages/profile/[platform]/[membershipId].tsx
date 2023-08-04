import { GetServerSideProps } from "next"
import { InitialProfileProps } from "../../../types/profile"
import ProfileWrapper from "../../../components/profile/ProfileWrapper"
import prisma from "../../../util/server/prisma"
import Cookies from "cookies"

export type VanityCookie = {
    destinyMembershipId: string
    destinyMembershipType: number
    userId: string | null
    string: string
}
const page = ProfileWrapper

export const getServerSideProps: GetServerSideProps<
    InitialProfileProps,
    { platform: string; membershipId: string }
> = async ({ params, res, req }) => {
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=59")

    try {
        const destinyMembershipType = Number(params!.platform)
        const vanity = await prisma.vanity.findFirst({
            where: {
                destinyMembershipId: params!.membershipId,
                destinyMembershipType
            },
            select: {
                destinyMembershipId: true,
                destinyMembershipType: true,
                userId: true,
                string: true
            }
        })

        if (vanity?.string) {
            const cookies = new Cookies(req, res)
            cookies.set("vanity", JSON.stringify(vanity))
            return {
                redirect: {
                    permanent: true,
                    destination: `/${vanity.string.toLowerCase()}`
                }
            }
        }
    } catch {}

    return {
        props: {
            destinyMembershipId: params!.membershipId,
            destinyMembershipType: Number(params!.platform)
        }
    }
}

export default page
