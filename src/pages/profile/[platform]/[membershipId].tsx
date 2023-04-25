import { shared as bungieClient } from "../../../util/http/bungie"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import Profile from "../../../components/profile/Profile"
import { InitialProfileProps } from "../../../util/types"
import Custom404 from "../../404"
import { useState } from "react"
import ErrorComponent from "../../../components/Error"

const StandardProfile = ({ bungieNetProfile, errorString }: InitialProfileProps) => {
    const [error, setError] = useState<Error | null>(errorString ? new Error(errorString) : null)
    if (error) return <ErrorComponent {...error} />
    else if (bungieNetProfile) return <Profile {...bungieNetProfile} errorHandler={setError} />
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

export default StandardProfile
