import { BungieMembershipType } from "bungie-net-core/models"
import { InitialProfileProps } from "../../../util/types"
import ProfileWrapper, { profileProps } from "../../../components/profile/ProfileWrapper"

export default ProfileWrapper

export async function getServerSideProps({
    params
}: {
    params: { platform: string; membershipId: string }
}): Promise<{ props: InitialProfileProps }> {
    const { platform: membershipType, membershipId: destinyMembershipId } = params
    return profileProps({
        destinyMembershipId,
        membershipType: membershipType as unknown as BungieMembershipType
    })
}
