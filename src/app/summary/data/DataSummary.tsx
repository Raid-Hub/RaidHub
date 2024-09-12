import { Collection } from "@discordjs/collection"
import { useMemo } from "react"
import Share from "~/components/icons/Share"
import { Grid } from "~/components/layout/Grid"
import { type RaidHubWorldFirstEntry } from "~/services/raidhub/types"
import { useRaidHubPlayers } from "~/services/raidhub/useRaidHubPlayers"
import { useRaidHubManifest } from "../../layout/wrappers/RaidHubManifestManager"
import { useSelectedPlayers } from "../context"
import { RaidSummaryCard } from "./RaidSummaryCard"

export const DataSummary = ({ generateEncodedCode }: { generateEncodedCode: () => string }) => {
    const selectedPlayers = useSelectedPlayers()
    const { listedRaids } = useRaidHubManifest()
    const playersQueries = useRaidHubPlayers(Array.from(selectedPlayers))

    const data = useMemo(() => {
        const statsByActivity = new Collection<
            number,
            {
                freshClears: number
                clears: number
                sherpas: number
                worldFirstEntries: Collection<string, RaidHubWorldFirstEntry>
            }
        >(
            listedRaids.map(id => [
                id,
                { freshClears: 0, clears: 0, sherpas: 0, worldFirstEntries: new Collection() }
            ])
        )
        playersQueries.players.forEach(player => {
            Object.values(player.stats.activity).forEach(activity => {
                if (!statsByActivity.has(activity.activityId)) {
                    statsByActivity.set(activity.activityId, {
                        freshClears: activity.freshClears,
                        clears: activity.clears,
                        sherpas: activity.sherpas,
                        worldFirstEntries: new Collection()
                    })
                } else {
                    const prev = statsByActivity.get(activity.activityId)!
                    statsByActivity.set(activity.activityId, {
                        freshClears: activity.freshClears + prev.freshClears,
                        clears: activity.clears + prev.clears,
                        sherpas: activity.sherpas + prev.sherpas,
                        worldFirstEntries: prev.worldFirstEntries
                    })
                }
            })
            Object.values(player.worldFirstEntries).forEach(entry => {
                if (!entry) return

                statsByActivity
                    .get(entry.activityId)!
                    .worldFirstEntries.set(entry.instanceId, entry)
            })
        })

        statsByActivity.forEach(v => v.worldFirstEntries.sort((a, b) => a.rank - b.rank))

        return statsByActivity
    }, [playersQueries.players, listedRaids])

    const generateURL = async () => {
        const code = generateEncodedCode()
        console.log(code)
        const url = window.location.origin + "/summary" + "?code=" + code

        await navigator.clipboard.writeText(url)

        window.alert("URL copied to clipboard: " + url.toString())
    }

    if (playersQueries.isLoading) {
        return <div>Loading...</div>
    }

    return (
        <section>
            <h2>Data Summary</h2>
            <button onClick={generateURL}>
                {"Share "}
                <Share color="white" sx={15} />
            </button>
            <Grid $minCardWidth={400}>
                {listedRaids.map(id => {
                    const dataForRaid = data.get(id)
                    if (!dataForRaid) return null

                    return <RaidSummaryCard key={id} {...dataForRaid} activityId={id} />
                })}
            </Grid>
        </section>
    )
}
