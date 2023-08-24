import { BungieMembershipType } from "bungie-net-core/lib/models"
import { ENTRIES_PER_PAGE } from "../../components/leaderboards/Leaderboard"
import { LeaderboardEntry, LeaderboardEntryParticipant } from "../../types/leaderboards"
type RRLeaderboardResponse = {
    response: {
        entries: RRLeaderboardEntry[]
        metadata: {
            page: number
            pageSize: number
            raid: string
            totalResults: number
            type: string
            version: string
        }
    }
}
type RRLeaderboardEntry = {
    value: number
    activityDetails: {
        instanceId: string
        membershipType: BungieMembershipType
    }
    destinyUserInfos: RRLeaderboardEntryUser[]
    rank: number
}
type RRLeaderboardEntryUser = {
    bungieGlobalDisplayName: string
    displayName: string
    iconPath: string
    membershipId: string
    membershipType: BungieMembershipType
}

export async function getLeaderboard(params: string[], page: number) {
    // this is temporary until our own API is up
    const url = new URL(
        `https://api.raidreport.dev/raid/leaderboard/${params
            .map(p =>
                p === "regicide" || p === "temposedge" || p === "challengecrota" ? "challenge" : p
            )
            .join("/")}?page=${page}&pageSize=${ENTRIES_PER_PAGE}`
    )
    try {
        const res = await fetch(url, {
            method: "GET"
        })

        if (res.ok) {
            const { response } = (await res.json()) as RRLeaderboardResponse
            return response.entries.map(
                e =>
                    ({
                        id: e.activityDetails.instanceId,
                        rank: e.rank,
                        url: `/pgcr/${e.activityDetails.instanceId}`,
                        timeInSeconds: e.value,
                        participants: e.destinyUserInfos.map(
                            usr =>
                                ({
                                    id: usr.membershipId,
                                    iconURL:
                                        "https://www.bungie.net/common/destiny2_content/icons/" +
                                        usr.iconPath,
                                    displayName: usr.bungieGlobalDisplayName || usr.displayName,
                                    url: `/profile/${usr.membershipType}/${usr.membershipId}`
                                } satisfies LeaderboardEntryParticipant)
                        )
                    } satisfies LeaderboardEntry)
            )
        } else {
            throw await res.json()
        }
    } catch (e) {
        console.error(e)
        return []
    }
}
