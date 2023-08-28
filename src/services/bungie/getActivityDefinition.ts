import { BungieClientProtocol } from "bungie-net-core"
import { getDestinyEntityDefinition } from "bungie-net-core/endpoints/Destiny2"
import {
    DestinyActivityModeDefinition,
    DestinyDefinition,
    DestinyProfileTransitoryComponent
} from "bungie-net-core/models"
export type CurrentActivityData = DestinyProfileTransitoryComponent & {
    currentActivityHash: number | null
}

export async function getActivityDefiniton({
    hashIdentifier,
    client
}: {
    mode?: boolean
    hashIdentifier: number
    client: BungieClientProtocol
}) {
    const { Response } = await getDestinyEntityDefinition(client, {
        hashIdentifier,
        entityType: "DestinyActivityDefinition"
    })

    return {
        ...Response,
        orbit: hashIdentifier === 82913930
    }
}

export async function getActivityModeDefiniton({
    hashIdentifier,
    client
}: {
    hashIdentifier: number
    client: BungieClientProtocol
}): Promise<DestinyDefinition<DestinyActivityModeDefinition> | null> {
    const { Response } = await getDestinyEntityDefinition(client, {
        hashIdentifier,
        entityType: "DestinyActivityModeDefinition"
    })
    return Response ?? null
}
