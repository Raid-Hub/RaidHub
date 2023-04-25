import { DestinyPostGameCarnageReportEntry } from "bungie-net-core/lib/models"
import PGCREntry from "./Entry"
import PGCRCharacter from "./Character"

export default class PGCRMember extends PGCREntry {
    readonly characters: PGCRCharacter[]
    private _deathless: boolean
    constructor(characters: DestinyPostGameCarnageReportEntry[]) {
        super(
            characters[0],
            characters.map(({ values, extended }) => ({
                values,
                extended
            }))
        )
        this._deathless = characters.every(
            character => character.values["deaths"].basic.value === 0
        )
        this.characters = characters.map(char => new PGCRCharacter(char))
    }

    get characterClass(): string {
        return this.characters.map(({ className }) => className).join("/")
    }

    get flawless(): boolean {
        return this._deathless && this.didComplete
    }

    get characterIds() {
        return this.characters.map(({ id }) => id)
    }

    get didComplete(): boolean {
        return this.characters.some(({ didComplete }) => didComplete)
    }
}
