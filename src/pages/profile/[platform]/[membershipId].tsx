import { GetStaticPropsResult } from "next"
import { InitialProfileProps } from "../../../types/profile"
import ProfileWrapper from "../../../components/profile/ProfileWrapper"
import prisma from "../../../util/server/prisma"
export async function getServerSideProps({
    params
}: {
    params: { platform: string; membershipId: string }
}): Promise<GetStaticPropsResult<InitialProfileProps>> {
    const vanity = await prisma.vanity.findFirst({
        where: {
            user: {
                destinyMembershipId: params.membershipId
            }
        }
    })

    if (vanity?.string) {
        return {
            redirect: {
                permanent: true,
                destination: `/${vanity.string}`
            }
        }
    } else {
        return {
            props: {
                destinyMembershipId: params.membershipId,
                membershipType: parseInt(params.platform)
            }
        }
    }
}

export default ProfileWrapper
