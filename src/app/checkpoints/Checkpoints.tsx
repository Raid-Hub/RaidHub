import { ErrorCard } from "~/components/ErrorCard"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { getCheckpoints } from "~/services/d2checkpoint/client"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { theme } from "../layout/theme"
import { ClientControls } from "./ClientControls"
import { CopyButton } from "./CopyButton"
import { CheckpointCard } from "./cards/CheckpointCard"
import { CheckpointCardContentSection } from "./cards/CheckpointCardContentSection"

type Checkpoint = {
    encounterImageURL: string
    maxPlayers: number
    currentPlayers: number
    encounterName: string
    difficultyTier: string
    botBungieName: string
    activityHash: string
    activityName: string
}

type GroupedCheckpoint = {
    title: string
    checkpoints: Checkpoint[]
}

export const Checkpoints = async () => {
    const [checkpoints, manifest] = await Promise.all([getCheckpoints(), prefetchManifest()])

    const groupedCheckpoints: GroupedCheckpoint[] = checkpoints.checkpoints.reduce(
        (groups: GroupedCheckpoint[], checkpoint: Checkpoint) => {
            const existingGroup = groups.find(
                (group: GroupedCheckpoint) =>
                    group.title ===
                    checkpoint.activityName
                        .replaceAll(`${checkpoint.difficultyTier}`, "")
                        .replaceAll(":", "")
            )
            if (existingGroup) {
                existingGroup.checkpoints.push(checkpoint)
            } else {
                groups.push({
                    title: checkpoint.activityName
                        .replaceAll(`${checkpoint.difficultyTier}`, "")
                        .replaceAll(":", ""),
                    checkpoints: [checkpoint]
                })
            }
            return groups
        },
        []
    )

    return (
        <>
            <Flex
                $padding={0}
                $direction="column"
                $crossAxis="flex-start"
                $fullWidth
                style={{ paddingBottom: 20 }}>
                {checkpoints.alert.active && <ErrorCard>{checkpoints.alert.message}</ErrorCard>}
                <ClientControls date={checkpoints.updatedAt} />
            </Flex>
            <Grid $minCardWidth={315} $gap={1.5}>
                {groupedCheckpoints
                    .filter(group =>
                        Object.keys(manifest.hashes).includes(group.checkpoints[0].activityHash)
                    )
                    .map(group => (
                        <CheckpointCard
                            title={group.title}
                            key={group.title}
                            encounter={group.checkpoints[0].encounterName}
                            encounterImageUrl={group.checkpoints[0].encounterImageURL}
                            encounterImageAlt={group.title}>
                            {group.checkpoints.map(checkpoint => (
                                <CheckpointCardContentSection
                                    maxPlayers={checkpoint.maxPlayers}
                                    currentPlayers={checkpoint.currentPlayers}
                                    sectionTitle={checkpoint.encounterName}
                                    sectionDifficulty={checkpoint.difficultyTier}
                                    key={checkpoint.difficultyTier}>
                                    <Flex
                                        $direction="row"
                                        $crossAxis="center"
                                        $gap={1}
                                        $padding={0}
                                        $align="flex-start"
                                        style={{ marginTop: "-1.8em" }}>
                                        <Flex
                                            $direction="row"
                                            $align="center"
                                            $crossAxis="center"
                                            $gap={0.2}
                                            $padding={0}>
                                            <h3 style={{ color: theme.colors.text.tertiary }}>|</h3>
                                            <p>{checkpoint.botBungieName}</p>
                                        </Flex>
                                        <CopyButton text={checkpoint.botBungieName} />
                                    </Flex>
                                </CheckpointCardContentSection>
                            ))}
                        </CheckpointCard>
                    ))}
            </Grid>
        </>
    )
}
