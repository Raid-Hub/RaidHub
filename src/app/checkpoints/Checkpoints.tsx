import { Collection } from "@discordjs/collection"
import Image from "next/image"
import { Card } from "~/components/Card"
import { ErrorCard } from "~/components/ErrorCard"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { getCheckpoints } from "~/services/d2checkpoint/http"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { theme } from "../layout/theme"
import { ClientControls } from "./ClientControls"
import { CopyButton } from "./CopyButton"
import { CardContent, CheckpointVersion, PulseAnimation } from "./card/CheckpointCard"
import { CardSplash, CardSplashTitleAbsolute } from "./splash/CheckpointCardSplash"

export const Checkpoints = async () => {
    const [checkpoints, manifest] = await Promise.all([getCheckpoints(), prefetchManifest()])

    const groupedCheckpoints = new Collection<
        string,
        {
            title: string
            image: string
            checkpoints: {
                key: number
                maxPlayers: number
                currentPlayers: number
                encounterName: string
                botBungieName: string
                versionName: string
            }[]
        }
    >()

    checkpoints.checkpoints.forEach(checkpoint => {
        const ids = manifest.hashes[checkpoint.activityHash]
        if (!ids) return

        const checkpointData = {
            key: checkpoint.key,
            maxPlayers: checkpoint.maxPlayers,
            currentPlayers: checkpoint.currentPlayers,
            encounterName: checkpoint.encounterName,
            versionName: manifest.versionDefinitions[ids.versionId]?.name ?? "Unknown",
            botBungieName: checkpoint.botBungieName
        }
        if (!groupedCheckpoints.has(checkpoint.encounterName)) {
            groupedCheckpoints.set(checkpoint.encounterName, {
                title: `${manifest.activityDefinitions[ids.activityId]?.name ?? "Unknown"}: ${
                    checkpoint.encounterName
                }`,
                image: checkpoint.encounterImageURL,
                checkpoints: [checkpointData]
            })
        } else {
            groupedCheckpoints.get(checkpoint.encounterName)!.checkpoints.push(checkpointData)
        }
    })

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
                {groupedCheckpoints.map(group => (
                    <Card key={group.title}>
                        <CardSplash>
                            <Image
                                unoptimized
                                src={group.image}
                                alt={group.title}
                                width={640}
                                height={360}
                                style={{ objectFit: "cover" }}
                            />
                            <CardSplashTitleAbsolute>{group.title}</CardSplashTitleAbsolute>
                        </CardSplash>
                        <CardContent $direction="column" $gap={0.75} $crossAxis="stretch">
                            {group.checkpoints.map(checkpoint => (
                                <Container key={checkpoint.key}>
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
                                            <CheckpointVersion>
                                                {checkpoint.versionName}
                                            </CheckpointVersion>
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
                                                    <PulseAnimation color="#61DC75" />
                                                )}
                                            {checkpoint.currentPlayers >= 3 &&
                                                checkpoint.currentPlayers <= 5 && (
                                                    <PulseAnimation color="#E5A830" />
                                                )}
                                            {checkpoint.currentPlayers >= 6 && (
                                                <PulseAnimation color="#E53030" />
                                            )}
                                        </Flex>
                                    </Flex>
                                    <Flex
                                        $direction="row"
                                        $crossAxis="center"
                                        $gap={1}
                                        $padding={0}
                                        $align="flex-start"
                                        $wrap
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
                                </Container>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </Grid>
        </>
    )
}
