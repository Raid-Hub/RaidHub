import { getRaidHubApi } from "."

export function playerQueryKey(membershipId: string) {
    return ["raidhub-player", membershipId] as const
}
export async function getPlayer(membershipId: string) {
    return getRaidHubApi("/player/{membershipId}/profile", { membershipId }, null)
}

export function getPlayerBasicKey(membershipId: string) {
    return ["raidhub-player-basic", membershipId] as const
}
export async function getPlayerBasic(membershipId: string) {
    return getRaidHubApi("/player/{membershipId}/basic", { membershipId }, null)
}
