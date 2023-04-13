import Profile from "../components/profile/Profile"
import { shared as bungieClient } from "../util/http/bungie"
import { Vanity } from "../util/special"
import { InitialProfileProps } from "../util/types"
import Custom404 from "./404"

const VanityProfile = ({ bungieNetProfile }: InitialProfileProps) => {
    if (!bungieNetProfile) return <Custom404 />
    else if (bungieNetProfile) return <Profile bungieNetProfile={bungieNetProfile} />
    else return <div>UH OH</div>
}

export async function getServerSideProps({
    params
}: {
    params: { vanity: string }
}): Promise<{ props: InitialProfileProps }> {
    const vanity = Vanity[params.vanity.toLowerCase()]
    if (!vanity) return { props: { error: "Vanity not found", bungieNetProfile: null } }
    const { membershipId, membershipType } = Vanity[params.vanity.toLowerCase()]
    const profile = await bungieClient.getProfile(membershipId, membershipType)
    return {
        props: {
            bungieNetProfile: profile.success ?? null,
            error: profile.error?.message ?? ""
        }
    }
}

export default VanityProfile
