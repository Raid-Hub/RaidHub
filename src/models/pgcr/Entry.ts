import { 
    DestinyPostGameCarnageReportEntry,
    BungieMembershipType,
    DestinyHistoricalStatsValue
  } from 'oodestiny/schemas'
import { PGCRStats } from './Stats'

abstract class PGCREntry {
    protected _membershipId: string
    protected _membershipType: BungieMembershipType
    protected _emblemPath: string
    protected _displayName: string
    protected _stats: PGCRStats
    constructor(data: DestinyPostGameCarnageReportEntry, stats: Record<string, DestinyHistoricalStatsValue> | Record<string, DestinyHistoricalStatsValue>[]) {
      const info = data.player.destinyUserInfo
      this._membershipId = info.membershipId,
      this._membershipType = info.membershipType,
      this._emblemPath = info.iconPath,
      this._displayName = info.bungieGlobalDisplayName ?? info.displayName
      this._stats = new PGCRStats(stats)
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
    constructor(membershipId: string, characters: DestinyPostGameCarnageReportEntry[]) {
      super(characters[0], characters.map(character => character.values));
      this._characters = characters.map(character => new PGCRCharacter(character))
    }

    get characterClass(): string {
      if (this._characters.length > 1) {
        return "Multiple Characters"
      } else {
        return this._characters[0].className
      }
    }
  }
  
export class PGCRCharacter extends PGCREntry {
    private _id: string
    private _className: string
    constructor(data: DestinyPostGameCarnageReportEntry) {
      super(data, data.values);
      this._id = data.characterId
      this._className = data.player.characterClass
    }

    get className(): string {
      return this._className
    }
  }