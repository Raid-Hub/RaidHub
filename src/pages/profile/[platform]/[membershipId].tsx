import { GetStaticPropsResult } from "next"
import { InitialProfileProps } from "../../../types/profile"
import ProfileWrapper from "../../../components/profile/ProfileWrapper"
import prisma from "../../../util/server/prisma"
export async function getServerSideProps({
    params
}: {
    params: { platform: string; membershipId: string }
}): Promise<GetStaticPropsResult<InitialProfileProps>> {
    const destinyMembershipType = Number(params.platform)
    const vanity = await prisma.vanity.findFirst({
        where: {
            destinyMembershipId: params.membershipId,
            destinyMembershipType
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
        return {
            props: {
                destinyMembershipId: params.membershipId,
                destinyMembershipType
            }
        }
    }
}

export default ProfileWrapper
