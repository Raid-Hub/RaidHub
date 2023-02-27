import { 
    DestinyPostGameCarnageReportEntry,
    BungieMembershipType,
    DestinyClass
  } from 'oodestiny/schemas'
import { CharacterLogos, CharacterName, CharacterType } from '../../util/characters'
import { PGCRStats, StatsKeys } from './PlayerStats'

export abstract class PGCREntry {
    protected _membershipId: string
    protected _membershipType: BungieMembershipType
    protected _displayName: string | undefined
    protected _stats: PGCRStats
    constructor(data: DestinyPostGameCarnageReportEntry, stats: StatsKeys | StatsKeys[]) {
      const info = data.player.destinyUserInfo
      this._membershipId = info.membershipId
      this._membershipType = info.membershipType
      this._displayName = info.bungieGlobalDisplayName || info.displayName
      this._stats = new PGCRStats(stats)
    }

    get membershipId() {
      return this._membershipId;
    }

    get membershipType() {
      return this._membershipType;
    }
  
    get displayName() {
      return this._displayName
    }

    get stats() {
      return this._stats
    }

    abstract get didComplete(): boolean
  }
  
export class PGCRMember extends PGCREntry {
    private _characters: PGCRCharacter[]
    private _flawless: boolean
    constructor(characters: DestinyPostGameCarnageReportEntry[]) {
      super(characters[0], characters.map(character => ({values: character.values, extended: character.extended})))
      this._flawless = characters.every(character => character.values["deaths"].basic.value === 0)
      this._characters = characters.map(char => new PGCRCharacter(char))
    }

    get characterClass(): string {
      return this._characters.map(char => char.className).join("/")
    }

    get flawless(): boolean {
      return this._flawless
    }

    get characterIds() {
      return this._characters.map(char => char.id)
    }

    get characters() {
      return this._characters
    }

    get didComplete(): boolean {
      return this._characters.some(c => c.didComplete)
    }
  }
  
export class PGCRCharacter extends PGCREntry {
    private _id: string
    private _className: string | undefined
    private _completed: boolean
    constructor(data: DestinyPostGameCarnageReportEntry) {
      super(data, {values: data.values, extended: data.extended});
      this._id = data.characterId
      this._className = data.player.characterClass
      this._completed = !!data.values.completed.basic.value
    }

    get id() {
      return this._id
    }

    get className(): string {
      return this._className ?? CharacterName[DestinyClass.Unknown]
    }

    get logo() {
      return CharacterLogos[CharacterType[this._className ?? ""]]
    }

    get didComplete(): boolean {
      return this._completed
    }
  }