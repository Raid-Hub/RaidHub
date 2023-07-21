import ProfileWrapper from "../components/profile/ProfileWrapper"
import { InitialProfileProps } from "../types/profile"
import { GetStaticPropsResult } from "next"
import prisma from "../util/server/prisma"

export async function getServerSideProps({
    params
}: {
    params: { vanity: string }
}): Promise<GetStaticPropsResult<InitialProfileProps>> {
    const details = await prisma.vanity.findFirst({
        where: {
            string: params.vanity
        },
        select: {
            destinyMembershipId: true,
            destinyMembershipType: true
        }
    })

    if (!details?.destinyMembershipId || !details.destinyMembershipType) {
        return { notFound: true }
    }

    return {
        props: details
    }
}

export default ProfileWrapper
