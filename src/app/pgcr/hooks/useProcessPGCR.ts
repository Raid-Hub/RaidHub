import { Collection, type ReadonlyCollection } from "@discordjs/collection"
import type {
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportEntry
} from "bungie-net-core/models"
import { useCallback } from "react"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import DestinyPGCRPlayer from "../models/Player"

export const useProcessPGCR = () => {
    const { getRaidFromHash } = useRaidHubManifest()

    return useCallback(
        (data: DestinyPostGameCarnageReportData) => {
            const startDate = new Date(data.period)
            const completionDate = new Date(
                startDate.getTime() +
                    (data.entries[0]?.values.activityDurationSeconds.basic.value * 1000 ?? 0)
            )

            const meta = getRaidFromHash(data.activityDetails.directorActivityHash)

            // group characters by membershipId
            const groupedEntries = new Collection<
                string,
                Collection<string, DestinyPostGameCarnageReportEntry>
            >()
            data.entries.forEach(char => {
                const membershipId = char.player.destinyUserInfo.membershipId
                if (groupedEntries.has(membershipId)) {
                    groupedEntries.get(membershipId)!.set(char.characterId, char)
                } else {
                    groupedEntries.set(membershipId, new Collection([[char.characterId, char]]))
                }
            })
            const players = groupedEntries
                .mapValues(coll => new DestinyPGCRPlayer(coll))
                .sort((a, b) => {
                    // sort by completion status, then by score
                    if (+a.completed ^ +b.completed) {
                        return a.completed ? -1 : 1
                    } else {
                        return b.score - a.score
                    }
                })

            return {
                hash: data.activityDetails.directorActivityHash,
                meta,
                startDate,
                completionDate,
                entryLength: data.entries.length,
                duration: data.entries[0]?.values.activityDurationSeconds.basic.value ?? 0,
                completed: players.some(p => p.completed),
                players: players as ReadonlyCollection<string, DestinyPGCRPlayer>
            }
        },
        [getRaidFromHash]
    )
}
