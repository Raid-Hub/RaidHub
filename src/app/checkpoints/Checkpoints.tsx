import Image from "next/image"
import { Card } from "~/components/Card"
import { ErrorCard } from "~/components/ErrorCard"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { H4 } from "~/components/typography/H4"
import { getCheckpoints } from "~/services/d2checkpoint/client"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { ClientControls } from "./ClientControls"
import { CopyButton } from "./CopyButton"

export const Checkpoints = async () => {
    const [checkpoints, manifest] = await Promise.all([getCheckpoints(), prefetchManifest()])

    return (
        <Flex $padding={0} $direction="column" $crossAxis="flex-start" $fullWidth>
            {checkpoints.alert.active && <ErrorCard>{checkpoints.alert.message}</ErrorCard>}
            <ClientControls date={checkpoints.updatedAt} />
            <Grid $fullWidth>
                {checkpoints.checkpoints
                    .filter(checkpoint =>
                        Object.keys(manifest.hashes).includes(checkpoint.activityHash)
                    )
                    .map(checkpoint => (
                        <Card key={checkpoint.key}>
                            <Container
                                $aspectRatio={{
                                    width: 24,
                                    height: 9
                                }}>
                                <Image
                                    unoptimized
                                    src={checkpoint.encounterImageURL}
                                    alt={checkpoint.activityName + ": " + checkpoint.encounterName}
                                    fill
                                    objectFit="cover"
                                />
                            </Container>
                            <Flex $direction="column" $padding={0.25} $gap={0.25}>
                                <H4 $mBlock={0.5}>{checkpoint.encounterName}</H4>
                                <H4 $mBlock={0}>{checkpoint.difficultyTier}</H4>
                                <Flex $padding={0}>
                                    <pre>{checkpoint.botBungieName}</pre>
                                    <CopyButton text={checkpoint.botBungieName} />
                                </Flex>
                            </Flex>
                        </Card>
                    ))}
            </Grid>
        </Flex>
    )
}
