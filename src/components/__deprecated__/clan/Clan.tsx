"use client"

import type { GroupResponse } from "bungie-net-core/models"
import { useMemo } from "react"
import { useClan, useMembersOfGroup } from "~/services/bungie/hooks"
import { fixClanName } from "~/util/destiny/fixClanName"
import { decodeHtmlEntities } from "~/util/presentation/formatting"
import { urlHighlight } from "~/util/presentation/urlHighlight"
import { ClanBannerComponent } from "../../ClanBanner"
import ClanMember from "./ClanMember"
import styles from "./clan.module.css"

/**
 * @deprecated
 */
export function ClanComponent(props: { groupId: string; clan: GroupResponse | null }) {
    const { data: clan } = useClan(
        { groupId: props.groupId },
        {
            staleTime: 5 * 60000,
            initialData: props.clan ?? undefined,
            suspense: true
        }
    )

    if (!clan) {
        throw new Error("Suspense fallback not implemented for ClanComponent.")
    }

    const clanMembersQueries = useMembersOfGroup(
        { groupId: props.groupId, pages: 2 },
        {
            select: result => result.results
        }
    )

    const allClanMembers = clanMembersQueries.flatMap(q => q.data ?? [])
    const isLoadingClanMembers = clanMembersQueries.some(q => q.isLoading)

    const clanName = useMemo(() => decodeHtmlEntities(fixClanName(clan.detail.name)), [clan])

    return (
        <div>
            <div className={styles["name-and-motto"]}>
                <h1 className={styles.name}>
                    {clanName}{" "}
                    <span className={styles["call-sign"]}>
                        {decodeHtmlEntities(`[${clan.detail.clanInfo.clanCallsign}]`)}
                    </span>
                </h1>
                <h3 className={styles.motto}>
                    <i>{decodeHtmlEntities(clan.detail.motto)}</i>
                </h3>
            </div>
            <section className={styles.overview}>
                <div className={styles["overview-left"]}>
                    <ClanBannerComponent data={clan.detail.clanInfo.clanBannerData} sx={30} />
                </div>
                <div className={styles.about}>
                    <p>{urlHighlight(clan.detail.about)}</p>
                </div>
            </section>

            {!isLoadingClanMembers && (
                <section>
                    <h2 key={"title"}>Members ({allClanMembers.length} / 100)</h2>
                    <div key={"members"} className={styles.members}>
                        {allClanMembers
                            .sort(
                                (m1, m2) =>
                                    new Date(m1.joinDate).getTime() -
                                    new Date(m2.joinDate).getTime()
                            )
                            .map(member => (
                                <ClanMember
                                    member={member}
                                    isFounder={member.memberType == 5}
                                    key={member.destinyUserInfo.membershipId}
                                />
                            ))}
                    </div>
                </section>
            )}

            {/* <section>
                            <h2>Progressions</h2>
                            {Object.values(clan.detail.clanInfo.d2ClanProgressions).map(
                                progression => (
                                    <div key={progression.progressionHash}>
                                        <h4>{progression.progressionHash}</h4>
                                        {progression.progressToNextLevel}
                                    </div>
                                )
                            )}
                        </section> */}
        </div>
    )
}
