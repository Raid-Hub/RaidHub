import { Vanity } from "../util/raidhub/special"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import Custom404 from "./404"
import Profile from "../components/profile/Profile"
import ProfileWrapper from "../components/profile/ProfileWrapper"
import { InitialProfileProps } from "../types/profile"

export async function getServerSideProps({
    params
}: {
    params: { vanity: string }
}): Promise<{ props: InitialProfileProps }> {
    const vanity = Vanity[params.vanity.toLowerCase()]
    if (!vanity) return { props: null }
    const details = Vanity[params.vanity.toLowerCase()]
    return { props: details }
}

export default ProfileWrapper
