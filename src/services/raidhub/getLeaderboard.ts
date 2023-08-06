import { BungieMembershipType } from "bungie-net-core/lib/models"

export type RRLeaderboardEntryUser = {
    bungieGlobalDisplayName: string
    displayName: string
    iconPath: string
    membershipId: string
    membershipType: BungieMembershipType
}
export type RRLeaderboardEntry = {
    value: number
    activityDetails: {
        instanceId: string
        membershipType: BungieMembershipType
    }
    destinyUserInfos: RRLeaderboardEntryUser[]
}

export async function getLeaderboard(params: string[], page: number) {
    return (await fetch(
        `https://api.raidreport.dev/raid/leaderboard/${params.join("/")}?page=${page}&pageSize=50`
    )
        .then(res => res.json())
        .then(data => data.response)) as {
        entries: RRLeaderboardEntry[]
    }
}
