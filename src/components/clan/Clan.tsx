import styles from "~/styles/pages/pgcr.module.css"
import Head from "next/head"
import Link from "next/link"
import { useMemo } from "react"
import { useClanContext } from "~/pages/clan/[groupId]"
import ClanBanner from "../profile/clan/ClanBanner"
import { fixClanName } from "~/util/destiny/fixClanName"
import { urlHighlight } from "~/util/presentation/urlHighlight"

export default function Clan() {
    const { clan } = useClanContext()

    const clanName = useMemo(() => (clan ? fixClanName(clan.detail.name) : null), [clan])

    return (
        <>
            <Head>
                <title key="title">{clanName ? `${clanName} | RaidHub` : "RaidHub"}</title>
            </Head>
            <main className={styles["main"]}>
                {clan && (
                    <>
                        <section>
                            <h1>
                                {clanName} [{clan.detail.clanInfo.clanCallsign}]
                            </h1>
                            <h3>{clan.detail.motto}</h3>
                            {clan.detail.clanBanner && (
                                <ClanBanner {...clan.detail.clanBanner} sx={20} />
                            )}
                            <p>{urlHighlight(clan.detail.about)}</p>
                        </section>

                        <section>
                            <h2>Members</h2>
                            {clan.groupMembers.map(member => (
                                <div key={member.destinyUserInfo.membershipId}>
                                    <Link
                                        href={`/profile/${member.destinyUserInfo.membershipType}/${member.destinyUserInfo.membershipId}`}>
                                        {member.destinyUserInfo.bungieGlobalDisplayName}
                                    </Link>
                                </div>
                            ))}
                        </section>

                        <section>
                            <h2>Progressions</h2>
                            {Object.values(clan.detail.clanInfo.d2ClanProgressions).map(
                                progression => (
                                    <div key={progression.progressionHash}>
                                        <h4>{progression.progressionHash}</h4>
                                        {progression.progressToNextLevel}
                                    </div>
                                )
                            )}
                        </section>
                    </>
                )}
            </main>
        </>
    )
}
