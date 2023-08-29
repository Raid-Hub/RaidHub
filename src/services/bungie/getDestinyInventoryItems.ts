import { BungieClientProtocol } from "bungie-net-core"
import { DestinyManifestLanguage, getDestinyManifestComponent } from "bungie-net-core/manifest"
import { DestinyInventoryItemDefinition, DestinyManifest } from "bungie-net-core/models"

export async function getDestinyInventoryItems({
    manifest,
    language,
    client
}: {
    manifest: DestinyManifest
    language: DestinyManifestLanguage
    client: BungieClientProtocol
}): Promise<Record<string, DestinyInventoryItemDefinition>> {
    const res = await getDestinyManifestComponent(client, {
        destinyManifest: manifest,
        tableName: "DestinyInventoryItemDefinition",
        language: language
    })
    return res
}
