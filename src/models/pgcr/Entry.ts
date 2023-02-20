import { 
    DestinyPostGameCarnageReportEntry,
    BungieMembershipType,
    DestinyHistoricalStatsValue,
    DestinyPostGameCarnageReportExtendedData
  } from 'oodestiny/schemas'
import { PGCRStats, StatsKeys } from './Stats'

abstract class PGCREntry {
    protected _membershipId: string
    protected _membershipType: BungieMembershipType
    protected _emblemPath: string
    protected _displayName: string
    protected _stats: PGCRStats
    constructor(data: DestinyPostGameCarnageReportEntry, stats: StatsKeys | StatsKeys[]) {
      const info = data.player.destinyUserInfo
      this._membershipId = info.membershipId,
      this._membershipType = info.membershipType,
      this._emblemPath = info.iconPath,
      this._displayName = info.bungieGlobalDisplayName ?? info.displayName
      this._stats = new PGCRStats(stats)
    }

    get membershipId() {
      return this._membershipId;
    }

    get membershipType() {
      return this._membershipType;
    }
  
    get displayName() {
      return this._displayName;
    }

    get stats() {
      return this._stats
    }
  }
  
export class PGCRMember extends PGCREntry {
    private _characters: PGCRCharacter[]
    private _flawless: boolean
    constructor(membershipId: string, characters: DestinyPostGameCarnageReportEntry[]) {
      super(characters[0], characters.map(character => ({values: character.values, extended: character.extended})))
      this._flawless = characters.every(character => character.values["deaths"].basic.value === 0)
      this._characters = characters.map(character => new PGCRCharacter(character))
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
  }
  
export class PGCRCharacter extends PGCREntry {
    private _id: string
    private _className: string
    constructor(data: DestinyPostGameCarnageReportEntry) {
      super(data, {values: data.values, extended: data.extended});
      this._id = data.characterId
      this._className = data.player.characterClass
    }

    get id() {
      return this._id
    }

    get className(): string {
      return this._className
    }
  }