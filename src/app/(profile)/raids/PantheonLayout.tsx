import { Collection } from "@discordjs/collection"
import { useMemo } from "react"
import { useRaidHubManifest } from "~/app/layout/managers"
import RaidCard from "~/components/__deprecated__/profile/raids/RaidCard"
import { Grid } from "~/components/layout/Grid"
import { type RaidHubPlayerActivitiesActivity } from "~/services/raidhub/types"
import { RaidCardContext } from "./RaidCardContext"

export const PantheonLayout = ({
    instances = new Collection(),
    isLoading
}: {
    instances?: Collection<string, RaidHubPlayerActivitiesActivity>
    isLoading: boolean
}) => {
    const { pantheonModes } = useRaidHubManifest()

    const instancesByMode = useMemo(() => {
        if (isLoading) return null

        const coll = new Collection<number, Collection<string, RaidHubPlayerActivitiesActivity>>()
        instances.forEach(a => {
            if (!coll.has(a.meta.versionId)) coll.set(a.meta.versionId, new Collection())
            coll.get(a.meta.versionId)!.set(a.instanceId, a)
        })
        return coll.each(raidActivities => raidActivities.reverse())
    }, [instances, isLoading])

    return (
        <Grid as="section" $minCardWidth={325} $minCardWidthMobile={300} $fullWidth $relative>
            {pantheonModes.map(mode => (
                <RaidCardContext
                    key={mode}
                    activities={instancesByMode?.get(mode)}
                    isLoadingActivities={isLoading}
                    raid={mode}>
                    <RaidCard leaderboardData={null} canExpand={false} />
                </RaidCardContext>
            ))}
        </Grid>
    )
}
