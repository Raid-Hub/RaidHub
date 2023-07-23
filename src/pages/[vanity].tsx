import ProfileWrapper from "../components/profile/ProfileWrapper"
import { InitialProfileProps } from "../types/profile"
import { GetStaticPropsResult } from "next"
import prisma from "../util/server/prisma"

export async function getServerSideProps({
    params
}: {
    params: { vanity: string }
}): Promise<GetStaticPropsResult<InitialProfileProps>> {
    try {
        const details = await prisma.vanity.findFirst({
            where: {
                string: params.vanity
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

export default ProfileWrapper
