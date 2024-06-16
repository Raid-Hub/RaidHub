import { ErrorCard } from "~/components/ErrorCard"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { getCheckpoints } from "~/services/d2checkpoint/client"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { theme } from "../layout/theme"
import { ClientControls } from "./ClientControls"
import { CopyButton } from "./CopyButton"

import Image from "next/image"
import { Card } from "~/components/Card"
import {
    CardContent,
    CheckpointDificulty,
    CheckpointTitle,
    PulseAnimation
} from "./card/CheckpointCard"
import { CardSplash, CardSplashTitleAbsolute } from "./splash/CheckpointCardSplash"

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
                        <Card key={group.title}>
                            <CardSplash>
                                <Image
                                    unoptimized
                                    src={group.checkpoints[0].encounterImageURL}
                                    alt={group.title}
                                    width={640}
                                    height={360}
                                    objectFit="cover"
                                />
                                <CardSplashTitleAbsolute>
                                    {group.title
                                        .toLowerCase()
                                        .replaceAll("normal", "")
                                        .replaceAll("master", "")
                                        .replaceAll(":", "")}
                                </CardSplashTitleAbsolute>
                            </CardSplash>
                            <CardContent $direction="column" $gap={0.75} $crossAxis="stretch">
                                {group.checkpoints.map(checkpoint => (
                                    <div key={checkpoint.encounterName + checkpoint.difficultyTier}>
                                        <Flex
                                            $direction="row"
                                            $crossAxis="center"
                                            $gap={0}
                                            $padding={0}
                                            $align="space-between">
                                            <Flex
                                                $direction="column"
                                                $crossAxis="flex-start"
                                                $gap={0}
                                                $padding={0}>
                                                <CheckpointTitle>
                                                    {checkpoint.encounterName}
                                                </CheckpointTitle>
                                                <CheckpointDificulty>
                                                    {checkpoint.difficultyTier}
                                                </CheckpointDificulty>
                                            </Flex>
                                            <Flex
                                                $direction="row"
                                                $crossAxis="center"
                                                $gap={0.5}
                                                $padding={0}
                                                $align="flex-start">
                                                {checkpoint.currentPlayers}/{checkpoint.maxPlayers}
                                                {checkpoint.currentPlayers <= 2 &&
                                                    checkpoint.maxPlayers >= 1 && (
                                                        <PulseAnimation backgroundColor="#61DC75" />
                                                    )}
                                                {checkpoint.currentPlayers >= 3 &&
                                                    checkpoint.currentPlayers <= 5 && (
                                                        <PulseAnimation backgroundColor="#E5A830" />
                                                    )}
                                                {checkpoint.currentPlayers >= 6 && (
                                                    <PulseAnimation backgroundColor="#E53030" />
                                                )}
                                            </Flex>
                                        </Flex>
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
                                                <h3 style={{ color: theme.colors.text.tertiary }}>
                                                    |
                                                </h3>
                                                <p>{checkpoint.botBungieName}</p>
                                            </Flex>
                                            <CopyButton text={checkpoint.botBungieName} />
                                        </Flex>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
            </Grid>
        </>
    )
}
