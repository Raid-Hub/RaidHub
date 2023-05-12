import { shared as bungieClient } from "../../../util/http/bungie"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { InitialProfileProps } from "../../../util/types"
import ProfileWrapper from "../../../components/profile/ProfileWrapper"

export default ProfileWrapper
export async function getServerSideProps({
    params
}: {
    params: { platform: string; membershipId: string }
}): Promise<{ props: InitialProfileProps }> {
    const { platform: membershipType, membershipId } = params
    try {
        const profile = await bungieClient.getProfile(
            membershipId,
            membershipType as unknown as BungieMembershipType
        )
        return {
            props: {
                bungieNetProfile: profile ?? null,
                errorString: ""
            }
        }
    } catch (e: any) {
        return {
            props: {
                bungieNetProfile: null,
                errorString: e.Message ?? e.message
            }
        }
    }
}
