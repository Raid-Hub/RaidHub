import styles from "~/styles/pages/profile/clan.module.css"
import Loading from "~/components/global/Loading"
import ClanBanner from "~/components/reusable/ClanBanner"
import { fixClanName } from "~/util/destiny/fixClanName"
import CustomError, { ErrorCode } from "~/models/errors/CustomError"
import { urlHighlight } from "~/util/presentation/urlHighlight"
import Link from "next/link"
import { useBungieClient } from "~/components/app/TokenManager"
import ErrorComponent from "~/components/global/Error"
import { useProfileProps } from "../Profile"
import { decodeHtmlEntities } from "~/util/presentation/formatting"

const ClanCard = () => {
    const { destinyMembershipId, destinyMembershipType } = useProfileProps()
    const bungie = useBungieClient()

    const {
        data: clan,
        isLoading,
        error
    } = bungie.clan.byMember.useQuery(
        { membershipId: destinyMembershipId, membershipType: destinyMembershipType },
        { staleTime: 10 * 60000 }
    )

    return isLoading ? (
        <Loading className={styles["card-loading"]} />
    ) : clan ? (
        <Link href={`/clan/${clan.groupId}`} className={styles["clan"]}>
            <div className={styles["clan-banner-container"]}>
                <ClanBanner data={clan.clanInfo.clanBannerData} sx={10} />
            </div>
            <div className={styles["desc"]}>
                <span className={styles["desc-title"]}>
                    {decodeHtmlEntities(
                        fixClanName(clan.name) + ` [${clan.clanInfo.clanCallsign}]`
                    )}
                </span>
                <span className={styles["desc-subtitle"]}>{clan?.motto}</span>
                <div className={styles["desc-text-wrapper"]}>
                    <p className={styles["desc-text"]}>{urlHighlight(clan?.about ?? "", false)}</p>
                </div>
            </div>
        </Link>
    ) : error ? (
        <ErrorComponent error={CustomError.handle(error, ErrorCode.Clan)} />
    ) : null
}

export default ClanCard
