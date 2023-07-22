import { BungieClientProtocol, BungieNetResponse } from "bungie-net-core/lib/api"
import { getDestinyEntityDefinition } from "bungie-net-core/lib/endpoints/Destiny2"
import { DestinyManifestComponent, DestinyManifestDefinition } from "bungie-net-core/lib/manifest"
import { AllManifestComponents } from "bungie-net-core/lib/manifest/manifest-types"
import {
    DestinyActivityDefinition,
    DestinyActivityModeDefinition,
    DestinyProfileTransitoryComponent
} from "bungie-net-core/lib/models"

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
    const { Response } = await getDestinyEntityDefinition(
        {
            hashIdentifier,
            entityType: DestinyManifestDefinition.DestinyActivityDefinition
        },
        client
    )

    return Response
}

export async function getActivityModeDefiniton({
    hashIdentifier,
    client
}: {
    hashIdentifier: number
    client: BungieClientProtocol
}) {
    const { Response } = await getDestinyEntityDefinition(
        {
            hashIdentifier,
            entityType: DestinyManifestDefinition.DestinyActivityModeDefinition
        },
        client
    )
    return Response
}
