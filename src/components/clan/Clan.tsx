import styles from "~/styles/pages/clan.module.css"
import Head from "next/head"
import { useMemo } from "react"
import { ClanPageProps } from "~/pages/clan/[groupId]"
import ClanBanner from "../reusable/ClanBanner"
import { fixClanName } from "~/util/destiny/fixClanName"
import { urlHighlight } from "~/util/presentation/urlHighlight"
import { useBungieClient } from "../app/TokenManager"
import { BungieAPIError } from "~/models/errors/BungieAPIError"
import Custom404 from "~/pages/404"
import Loading from "../global/Loading"
import ClanMember from "./ClanMember"

export default function Clan({ groupId }: ClanPageProps) {
    const bungie = useBungieClient()
    const {
        data: clan,
        isError,
        error
    } = bungie.clan.byId.useQuery(
        { groupId },
        { staleTime: 10 * 60000 /*clan does not update very often*/ }
    )
    const { data: clanMembers, isLoading: isLoadingClanMembers } = bungie.clan.members.useQuery(
        { groupId },
        { staleTime: 5 * 60000 }
    )

    const { data: clanFounders, isLoading: isLoadingFounders } = bungie.clan.founders.useQuery(
        { groupId },
        { staleTime: 5 * 60000 }
    )

    const clanName = useMemo(() => (clan ? fixClanName(clan.detail.name) : null), [clan])

    if (isError) {
        if (error instanceof BungieAPIError) {
            error.ErrorCode === 622 // group not found
            return <Custom404 error={error.Message} />
        }
    }

    return (
        <>
            <Head>
                <title key="title">{clanName ? `${clanName} | RaidHub` : "RaidHub"}</title>
            </Head>
            <main className={styles["main"]}>
                {clan && (
                    <>
                        <div className={styles["name-and-motto"]}>
                            <h1 className={styles["name"]}>
                                {clanName}{" "}
                                <span className={styles["call-sign"]}>
                                    [{clan.detail.clanInfo.clanCallsign}]
                                </span>
                            </h1>
                            <h3 className={styles["motto"]}>
                                <i>{clan.detail.motto}</i>
                            </h3>
                        </div>
                        <section className={styles["overview"]}>
                            <div className={styles["overview-left"]}>
                                <ClanBanner data={clan.detail.clanInfo.clanBannerData} sx={30} />
                            </div>
                            <div className={styles["about"]}>
                                <p>{urlHighlight(clan.detail.about)}</p>
                            </div>
                        </section>

                        <section>
                            {isLoadingClanMembers || isLoadingFounders ? (
                                <Loading className="" />
                            ) : (
                                clanMembers && [
                                    <h2 key={"title"}>Members ({clanMembers.length} / 100)</h2>,
                                    <div key={"members"} className={styles["members"]}>
                                        {clanMembers
                                            .sort(
                                                (m1, m2) =>
                                                    new Date(m1.joinDate).getTime() -
                                                    new Date(m2.joinDate).getTime()
                                            )
                                            .map(member => (
                                                <ClanMember
                                                    member={member}
                                                    isFounder={
                                                        member.destinyUserInfo.membershipId ==
                                                        clanFounders![0].destinyUserInfo
                                                            .membershipId
                                                    }
                                                    key={member.destinyUserInfo.membershipId}
                                                />
                                            ))}
                                    </div>
                                ]
                            )}
                        </section>

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
                    </>
                )}
            </main>
        </>
    )
}
