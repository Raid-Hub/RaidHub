import styles from "../../../styles/pages/profile/clan.module.css"
import Loading from "../../global/Loading"
import ClanBanner from "../../reusable/ClanBanner"
import { fixClanName } from "../../../util/destiny/fixClanName"
import { BungieMembershipType } from "bungie-net-core/models"
import CustomError, { ErrorCode } from "~/models/errors/CustomError"
import { urlHighlight } from "~/util/presentation/urlHighlight"
import Link from "next/link"
import { useBungieClient } from "~/components/app/TokenManager"

type ClanCardProps = {
    membershipId: string
    membershipType: BungieMembershipType
}

const ClanCard = ({ membershipId, membershipType }: ClanCardProps) => {
    const bungie = useBungieClient()

    const {
        data: clan,
        isLoading,
        error
    } = bungie.clan.byMember.useQuery({ membershipId, membershipType }, { staleTime: 10 * 60000 })

    return isLoading ? (
        <Loading wrapperClass={styles["card-loading"]} />
    ) : clan ? (
        <Link href={`/clan/${clan.groupId}`} className={styles["clan"]}>
            <div className={styles["clan-banner-container"]}>
                <ClanBanner data={clan.clanInfo.clanBannerData} sx={10} />
            </div>
            <div className={styles["desc"]}>
                <span className={styles["desc-title"]}>
                    {fixClanName(clan.name) + ` [${clan.clanInfo.clanCallsign}]`}
                </span>
                <span className={styles["desc-subtitle"]}>{clan?.motto}</span>
                <div className={styles["desc-text-wrapper"]}>
                    <p className={styles["desc-text"]}>{urlHighlight(clan?.about ?? "")}</p>
                </div>
            </div>
        </Link>
    ) : error ? (
        <div className={styles["clan"]} style={{ flexDirection: "column", gap: "1em" }}>
            <div>Error Loading Clan</div>
            <div>{CustomError.handle(e => e.message, error, ErrorCode.Clan)}</div>
        </div>
    ) : null
}

export default ClanCard
