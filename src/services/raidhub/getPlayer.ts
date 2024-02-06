import { getRaidHubApi } from "."
export function getPlayerBasicKey(membershipId: string) {
    return ["raidhub-player-basic", membershipId] as const
}
export async function getPlayerBasic(membershipId: string) {
    return getRaidHubApi("/player/{membershipId}/basic", { membershipId }, null)
}
