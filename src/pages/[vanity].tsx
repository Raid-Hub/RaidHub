import { Vanity } from "../util/special"
import { InitialProfileProps } from "../util/types"
import ProfileWrapper, { profileProps } from "../components/profile/ProfileWrapper"

export default ProfileWrapper

export async function getServerSideProps({
    params
}: {
    params: { vanity: string }
}): Promise<{ props: InitialProfileProps }> {
    const vanity = Vanity[params.vanity.toLowerCase()]
    if (!vanity) return { props: { errorString: "Page not found", bungieNetProfile: null } }
    const { destinyMembershipId, membershipType } = Vanity[params.vanity.toLowerCase()]

    return profileProps({ destinyMembershipId, membershipType })
}
