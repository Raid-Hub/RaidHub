import { RaidReportPlayer } from "../../types/raidreport"

type GetPlayerResponse = {
    response: RaidReportPlayer
}
export async function getPlayer(destinyMembershipId: string): Promise<RaidReportPlayer> {
    const url = new URL(`https://api.raidreport.dev/raid/player/${destinyMembershipId}`)
    const res = await fetch(url, {
        method: "GET"
    })
    if (res.ok) {
        const { response } = (await res.json()) as GetPlayerResponse
        return response
    } else {
        throw await res.json()
    }
}
