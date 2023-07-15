import { BungieClientProtocol, BungieNetResponse } from "bungie-net-core/lib/api"
import { getDestinyEntityDefinition } from "bungie-net-core/lib/endpoints/Destiny2"
import {
    DestinyActivityDefinition,
    DestinyActivityModeDefinition,
    DestinyComponentType,
    DestinyProfileTransitoryComponent
} from "bungie-net-core/lib/models"
import PrivateProfileError from "../../models/errors/PrivateProfileError"

export type CurrentActivityData = DestinyProfileTransitoryComponent & {
    currentActivityHash: number | null
}

export async function getActivityDefiniton({
    hashIdentifier,
    mode,
    client
}: {
    mode?: boolean
    hashIdentifier: number
    client: BungieClientProtocol
}) {
    const { Response } = (await getDestinyEntityDefinition(
        {
            hashIdentifier,
            entityType: "DestinyActivityDefinition"
        },
        client
    )) as BungieNetResponse<DestinyActivityDefinition>

    return Response
}

export async function getActivityModeDefiniton({
    hashIdentifier,
    client
}: {
    hashIdentifier: number
    client: BungieClientProtocol
}) {
    const { Response } = (await getDestinyEntityDefinition(
        {
            hashIdentifier,
            entityType: "DestinyActivityModeDefinition"
        },
        client
    )) as BungieNetResponse<DestinyActivityModeDefinition>

    return Response
}
