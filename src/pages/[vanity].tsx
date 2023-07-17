import ProfileWrapper from "../components/profile/ProfileWrapper"
import { InitialProfileProps } from "../types/profile"
import { GetStaticPropsResult } from "next"
import prisma from "../util/server/prisma"

export async function getServerSideProps({
    params
}: {
    params: { vanity: string }
}): Promise<GetStaticPropsResult<InitialProfileProps>> {
    const user = await prisma.user.findFirst({
        where: {
            vanity: {
                string: params.vanity
            }
        },
        include: {
            vanity: true
        }
    })

    if (!user?.destinyMembershipId || !user.destinyMembershipType) {
        return { notFound: true }
    }

    return {
        props: {
            destinyMembershipId: user.destinyMembershipId,
            membershipType: user.destinyMembershipType
        }
    }
}

export default ProfileWrapper
