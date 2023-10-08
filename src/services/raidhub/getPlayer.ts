export function playerQueryKey(membershipId: string) {
    return ["raidhub-player", membershipId] as const
}
export async function getPlayer(membershipId: string): Promise<{ data: unknown }> {
    // todo: implement raidhub api
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
        data: membershipId
    }
}
