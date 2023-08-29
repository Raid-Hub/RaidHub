import { DestinyPostGameCarnageReportEntry } from "bungie-net-core/models"
/**
 * Determines if an entry was a non-participant in the raid
 * @param entry The entry to determine to ensure
 * @returns
 */
export function nonParticipant(entry: DestinyPostGameCarnageReportEntry): boolean {
    return (
        entry.values.timePlayedSeconds?.basic.value <= 25 &&
        entry.values.kills?.basic.value === 0 &&
        entry.values.deaths?.basic.value === 0
    )
}
