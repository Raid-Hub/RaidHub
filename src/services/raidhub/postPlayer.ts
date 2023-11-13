import { RaidHubAPIResponse } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "./createHeaders"
import { BungieMembershipType } from "bungie-net-core/models"
import { Collection } from "@discordjs/collection"

type Props = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    characterId: string
}[]

export function postPlayerQueryKey(characters: Props) {
    return ["raidhub-profileplayer-post", characters] as const
}
export async function postPlayer(props: Props) {
    const url = new URL(getRaidHubBaseUrl() + `/player/log`)

    const coll = new Collection<
        string,
        { membershipType: BungieMembershipType; characterIds: string[] }
    >()
    props.forEach(p => {
        if (coll.has(p.destinyMembershipId)) {
            coll.get(p.destinyMembershipId)!.characterIds.push(p.characterId)
        } else {
            coll.set(p.destinyMembershipId, {
                membershipType: p.membershipType,
                characterIds: [p.characterId]
            })
        }
    })
    const res = await fetch(url, {
        method: "POST",
        headers: { ...createHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(coll))
    })

    const data = (await res.json()) as RaidHubAPIResponse<unknown>
    if (data.success) {
        return data.response
    } else {
        throw new Error(data.message)
    }
}
