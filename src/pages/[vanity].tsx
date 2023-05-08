import { useState } from "react"
import ErrorComponent from "../components/Error"
import Profile from "../components/profile/Profile"
import { shared as bungieClient } from "../util/http/bungie"
import { Vanity } from "../util/special"
import { InitialProfileProps } from "../util/types"

const VanityProfile = ({ bungieNetProfile, errorString }: InitialProfileProps) => {
    const [error, setError] = useState<Error | null>(errorString ? new Error(errorString) : null)
    if (error) return <ErrorComponent error={error} />
    else if (bungieNetProfile) return <Profile {...bungieNetProfile} errorHandler={setError} />
    else return <div>UH OH</div>
}

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

export default VanityProfile
