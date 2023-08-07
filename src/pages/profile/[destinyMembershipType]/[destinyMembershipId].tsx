import ProfileWrapper from "../../../components/profile/ProfileWrapper"
import { GetServerSideProps, NextPage } from "next"
import { InitialProfileProps } from "../../../types/profile"
import { zUniqueDestinyProfile } from "../../../util/server/zod"
import prisma from "../../../util/server/prisma"

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
