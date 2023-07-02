import { InitialProfileProps } from "../../../types/profile"
import ProfileWrapper from "../../[vanity]"

export async function getServerSideProps({
    params
}: {
    params: { platform: string; membershipId: string }
}): Promise<{ props: InitialProfileProps }> {
    return {
        props: {
            destinyMembershipId: params.membershipId,
            membershipType: parseInt(params.platform)
        }
    }
}

export default ProfileWrapper
