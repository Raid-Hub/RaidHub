import { shared as bungieClient } from "../../../util/http/bungie"
import { BungieMembershipType } from "oodestiny/schemas"
import Profile from "../../../components/profile/Profile"
import { InitialProfileProps } from "../../../util/types"

const StandardProfile = ({ bungieNetProfile }: InitialProfileProps) => {
    if (bungieNetProfile) return <Profile {...bungieNetProfile} />
    else return <div>UH OH</div>
}

export async function getServerSideProps({
    params
}: {
    params: { platform: string; membershipId: string }
}): Promise<{ props: InitialProfileProps }> {
    const { platform: membershipType, membershipId } = params
    const profile = await bungieClient.getProfile(
        membershipId,
        membershipType as unknown as BungieMembershipType
    )
    return {
        props: {
            bungieNetProfile: profile.success ?? null,
            error: profile.error?.message ?? ""
        }
    }
}

export default StandardProfile
