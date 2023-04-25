import { DestinyClass, DestinyPostGameCarnageReportEntry } from "bungie-net-core/lib/models"
import PGCREntry from "./Entry"
import { CharacterLogos, CharacterName, CharacterType } from "../../util/characters"

export default class PGCRCharacter extends PGCREntry {
    readonly id: string
    readonly className: string | undefined
    readonly didComplete: boolean
    constructor(data: DestinyPostGameCarnageReportEntry) {
        super(data, { values: data.values, extended: data.extended })
        this.id = data.characterId
        this.className = data.player.characterClass ?? CharacterName[DestinyClass.Unknown]
        this.didComplete = !!data.values.completed.basic.value
    }

    get logo() {
        return CharacterLogos[CharacterType[this.className ?? ""]]
    }
}
