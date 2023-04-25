import { shared as bungieClient } from "../../../util/http/bungie"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import Profile from "../../../components/profile/Profile"
import { InitialProfileProps } from "../../../util/types"
import Custom404 from "../../404"

const StandardProfile = ({ bungieNetProfile, error }: InitialProfileProps) => {
    if (bungieNetProfile) return <Profile {...bungieNetProfile} />
    else if (error) return <Custom404 error={error} />
    else return <div>UH OH</div>
}

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
                error: ""
            }
        }
    } catch (e: any) {
        return {
            props: {
                bungieNetProfile: null,
                error: e.Message ?? e.message
            }
        }
    }
}

export default StandardProfile
