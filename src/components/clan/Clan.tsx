import styles from "~/styles/pages/pgcr.module.css"
import Head from "next/head"
import Link from "next/link"
import { useMemo } from "react"
import { ClanPageProps } from "~/pages/clan/[groupId]"
import ClanBanner from "../reusable/ClanBanner"
import { fixClanName } from "~/util/destiny/fixClanName"
import { urlHighlight } from "~/util/presentation/urlHighlight"
import { useBungieClient } from "../app/TokenManager"
import { BungieAPIError } from "~/models/errors/BungieAPIError"
import Custom404 from "~/pages/404"
import Loading from "../global/Loading"

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
                        <section>
                            <h1>
                                {clanName} [{clan.detail.clanInfo.clanCallsign}]
                            </h1>
                            <h3>{clan.detail.motto}</h3>
                            <ClanBanner data={clan.detail.clanInfo.clanBannerData} sx={20} />
                            <p>{urlHighlight(clan.detail.about)}</p>
                        </section>

                        <section>
                            <h2>Members</h2>
                            {isLoadingClanMembers ? (
                                <Loading className="" />
                            ) : (
                                clanMembers &&
                                clanMembers.map(member => (
                                    <div key={member.destinyUserInfo.membershipId}>
                                        <Link
                                            href={`/profile/${member.destinyUserInfo.membershipType}/${member.destinyUserInfo.membershipId}`}>
                                            {member.destinyUserInfo.bungieGlobalDisplayName}
                                        </Link>
                                    </div>
                                ))
                            )}
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
