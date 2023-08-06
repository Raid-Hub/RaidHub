import ProfileWrapper from "../../../components/profile/ProfileWrapper"
import { GetServerSideProps, NextPage } from "next"
import { InitialProfileProps, VanityCookie } from "../../../types/profile"
import { zUniqueDestinyProfile } from "../../../util/server/zod"
import prisma from "../../../util/server/prisma"
import Cookies from "cookies"

const ProfilePage: NextPage<InitialProfileProps> = props => {
    return <ProfileWrapper {...props} />
}

export const getServerSideProps: GetServerSideProps<InitialProfileProps> = async ({
    params,
    res,
    req
}) => {
    try {
        const props = zUniqueDestinyProfile.parse(params)
        const vanity = await prisma.vanity.findUnique({
            where: {
                destinyMembershipId_destinyMembershipType: props
            }
        })

        if (vanity?.string) {
            const cookies = new Cookies(req, res)
            cookies.set("vanity", JSON.stringify(vanity satisfies VanityCookie))
            return {
                redirect: {
                    permanent: true,
                    destination: `/${vanity.string.toLowerCase()}`
                }
            }
        } else {
            return { props }
        }
    } catch {
        return { notFound: true }
    }
}

export default ProfilePage
