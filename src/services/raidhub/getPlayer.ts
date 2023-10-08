export function playerQueryKey(membershipId: string) {
    return ["raidhub-player", membershipId] as const
}
export async function getPlayer(membershipId: string): Promise<{ data: unknown }> {
    // todo: implement raidhub api
    return {
        data: []
    }
}
