import Profile from "../components/profile/Profile"
import { shared as bungieClient } from "../util/http/bungie"
import { Vanity } from "../util/special"
import { InitialProfileProps } from "../util/types"
import Custom404 from "./404"

const VanityProfile = ({ bungieNetProfile, error }: InitialProfileProps) => {
    if (bungieNetProfile) return <Profile {...bungieNetProfile} />
    else if (error) return <Custom404 error={error} />
    else return <div>UH OH</div>
}

export async function getServerSideProps({
    params
}: {
    params: { vanity: string }
}): Promise<{ props: InitialProfileProps }> {
    const vanity = Vanity[params.vanity.toLowerCase()]
    if (!vanity) return { props: { error: "Page not found", bungieNetProfile: null } }
    const { membershipId, membershipType } = Vanity[params.vanity.toLowerCase()]
    try {
        const profile = await bungieClient.getProfile(membershipId, membershipType)
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

export default VanityProfile
