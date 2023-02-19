import { DestinyHistoricalStatsValue } from 'oodestiny/schemas'

export class PGCRStats {
    private _kills: number;
    private _deaths: number;
    private _assists: number;
    private _startSeconds: number
    private _timePlayedSeconds: number
    constructor(data: Record<string, DestinyHistoricalStatsValue> | Record<string, DestinyHistoricalStatsValue>[]) {
      this._kills = 0
      this._deaths = 0
      this._assists = 0
      this._startSeconds = Number.MAX_SAFE_INTEGER
      this._timePlayedSeconds = 0
      if (Array.isArray(data)) {
        this.merge(data)
      } else {
        this.init(data)
      }
    }
  
    private init(data: Record<string, DestinyHistoricalStatsValue>) {
      this._kills = data['kills'].basic.value
      this._deaths = data['deaths'].basic.value
      this._assists = data['assists'].basic.value
      this._startSeconds = data['startSeconds'].basic.value
      this._timePlayedSeconds = data['timePlayedSeconds'].basic.value
    }
  
    private merge(data: Record<string, DestinyHistoricalStatsValue>[]) {
      const maxTimePlayed = data[0]['activityDurationSeconds'].basic.value;
      data.forEach(entry => {
        this._kills += entry['kills'].basic.value
        this._deaths += entry['deaths'].basic.value
        this._assists += entry['assists'].basic.value
        this._startSeconds = Math.min(entry['startSeconds'].basic.value, this._startSeconds)
        this._timePlayedSeconds += entry['timePlayedSeconds'].basic.value
      })
      this._timePlayedSeconds = Math.min(this._timePlayedSeconds, maxTimePlayed)
    }
  
    get kills() {
      return this._kills
    }
  
    get deaths() {
      return this._deaths
    }
  
    get assists() {
      return this._assists
    }
  
    get kdr() {
      return round(this._kills / (this._deaths || 1), 2);
    }
  
    get kda() {
      return round((this._kills + this._assists) / (this._deaths || 1), 2);
    }
  }
  
  function round(val: number, places: number): number {
    const factor = Math.pow(10, places);
    return Math.round(val * factor) / factor
  }