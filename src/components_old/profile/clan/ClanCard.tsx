import styles from "~/styles/pages/profile/clan.module.css"
import ClanBanner from "~/components/reusable/ClanBanner"
import { fixClanName } from "~/util/destiny/fixClanName"
import Link from "next/link"
import { useBungieClient } from "~/components/app/TokenManager"
import { useProfileProps } from "../Profile"
import { decodeHtmlEntities } from "~/util/presentation/formatting"

const ClanCard = () => {
    const { destinyMembershipId, destinyMembershipType } = useProfileProps()
    const bungie = useBungieClient()

    const { data: clan } = bungie.clan.byMember.useQuery(
        { membershipId: destinyMembershipId, membershipType: destinyMembershipType },
        { staleTime: 10 * 60000 }
    )

    return clan ? (
        <Link href={`/clan/${clan.groupId}`} className={styles["clan"]}>
            <span className={styles["desc-title"]}>
                {decodeHtmlEntities(fixClanName(clan.name) + ` [${clan.clanInfo.clanCallsign}]`)}
            </span>
            <div className={styles["clan-banner-container"]}>
                <ClanBanner data={clan.clanInfo.clanBannerData} sx={10} />
            </div>
        </Link>
    ) : null
}

export default ClanCard
