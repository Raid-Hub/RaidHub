import ProfileWrapper from "../components/profile/ProfileWrapper"
import { InitialProfileProps } from "../types/profile"
import { GetServerSideProps } from "next"
import prisma from "../util/server/prisma"
import Cookies from "cookies"
import { VanityCookie } from "./profile/[platform]/[membershipId]"

const page = ProfileWrapper

export const getServerSideProps: GetServerSideProps<
    InitialProfileProps,
    { vanity: string }
> = async ({ params, res, req }) => {
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=59")

    try {
        if (req.cookies["vanity"]) {
            const { destinyMembershipId, destinyMembershipType } = JSON.parse(
                req.cookies.vanity
            ) as VanityCookie
            const cookies = new Cookies(req, res)
            cookies.set("vanity")
            return {
                props: {
                    destinyMembershipId,
                    destinyMembershipType
                }
            }
        }

        const details = await prisma.vanity.findFirst({
            where: {
                string: params!.vanity
            },
            select: {
                destinyMembershipId: true,
                destinyMembershipType: true
            }
        })

        if (details?.destinyMembershipId && details.destinyMembershipType) {
            return { props: details }
        }
    } catch {}
    return { notFound: true }
}

export default page
