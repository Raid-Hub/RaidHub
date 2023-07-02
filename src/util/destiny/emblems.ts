// TODO: move these to a CDN
// @ts-ignore
import EmblemsJson from "../../util/destiny-definitions/emblems.json" assert { type: "json" }
const emblems: { [hash: string]: string } = EmblemsJson

export const defaultEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"

export function emblemFromHash(hash: number) {
    return emblems[hash] ?? defaultEmblem
}
