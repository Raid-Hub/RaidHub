import {
    DestinyManifestComponent,
    DestinyManifestDefinition,
    DestinyManifestLanguage,
    getDestinyManifestComponent
} from "bungie-net-core/lib/manifest"
import { DestinyInventoryItemDefinition, DestinyManifest } from "bungie-net-core/lib/models"

export async function getDestinyInventoryItems({
    manifest,
    language
}: {
    manifest: DestinyManifest
    language: DestinyManifestLanguage
}): Promise<DestinyManifestComponent<DestinyInventoryItemDefinition>> {
    const res = await getDestinyManifestComponent({
        destinyManifest: manifest,
        tableName: DestinyManifestDefinition.DestinyInventoryItemDefinition,
        language: language
    })
    return res
}
