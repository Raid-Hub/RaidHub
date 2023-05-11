import ProfileWrapper from "../components/profile/ProfileWrapper"
import { shared as bungieClient } from "../util/http/bungie"
import { Vanity } from "../util/special"
import { InitialProfileProps } from "../util/types"

export default ProfileWrapper

export async function getServerSideProps({
    params
}: {
    params: { vanity: string }
}): Promise<{ props: InitialProfileProps }> {
    const vanity = Vanity[params.vanity.toLowerCase()]
    if (!vanity) return { props: { errorString: "Page not found", bungieNetProfile: null } }
    const { membershipId, membershipType } = Vanity[params.vanity.toLowerCase()]
    try {
        const profile = await bungieClient.getProfile(membershipId, membershipType)
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
