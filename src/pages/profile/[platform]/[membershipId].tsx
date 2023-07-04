import { GetStaticPropsResult, Redirect } from "next"
import { InitialProfileProps } from "../../../types/profile"
import { Vanity } from "../../../util/raidhub/special"
import ProfileWrapper from "../../[vanity]"

export async function getServerSideProps({
    params
}: {
    params: { platform: string; membershipId: string }
}): Promise<GetStaticPropsResult<InitialProfileProps>> {
    const vanity = Object.entries(Vanity).find(
        ([_, { destinyMembershipId }]) => destinyMembershipId === params.membershipId
    )?.[0]

    if (vanity) {
        return {
            redirect: {
                permanent: true,
                destination: `/${vanity}`
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
