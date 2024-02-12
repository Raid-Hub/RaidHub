"use client"

import Link from "next/link"
import { type ProfileProps } from "~/app/(profile)/types"
import { ClanBannerComponent } from "~/components/ClanBanner"
import { Loading } from "~/components/Loading"
import { usePageProps } from "~/components/layout/PageWrapper"
import { useClanForMember } from "~/services/bungie/useClanForMember"
import { fixClanName } from "~/util/destiny/fixClanName"
import { decodeHtmlEntities } from "~/util/presentation/formatting"
import styles from "./clan.module.css"

/** @deprecated */
export const ClanCard = () => {
    const { destinyMembershipId, destinyMembershipType } = usePageProps<ProfileProps>()

    const { data: clan } = useClanForMember(
        { membershipId: destinyMembershipId, membershipType: destinyMembershipType },
        {
            staleTime: 10 * 60000,
            select: res => (res.results.length > 0 ? res.results[0].group : null)
        }
    )

    if (clan === undefined) return <Loading />

    return clan ? (
        <Link href={`/clan/${clan.groupId}`} className={styles.clan}>
            <span className={styles["desc-title"]}>
                {decodeHtmlEntities(fixClanName(clan.name) + ` [${clan.clanInfo.clanCallsign}]`)}
            </span>
            <div className={styles["clan-banner-container"]}>
                <ClanBannerComponent data={clan.clanInfo.clanBannerData} sx={10} />
            </div>
        </Link>
    ) : null
}
