import { type Collection } from "@discordjs/collection"
import styled from "styled-components"
import { Card } from "~/components/Card"
import { CloudflareImage } from "~/components/CloudflareImage"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { getRaidSplash } from "~/data/activity-images"
import { type RaidHubWorldFirstEntry } from "~/services/raidhub/types"
import { useRaidHubManifest } from "../../layout/wrappers/RaidHubManifestManager"
import { WorldFirstEntryComponent } from "./WorldFirstEntryComponent"

export const RaidSummaryCard = ({
    activityId,
    freshClears,
    clears,
    sherpas,
    worldFirstEntries
}: {
    activityId: number
    freshClears: number
    clears: number
    sherpas: number
    worldFirstEntries: Collection<string, RaidHubWorldFirstEntry>
}) => {
    const { getActivityDefinition } = useRaidHubManifest()
    const activityDefinition = getActivityDefinition(activityId)

    if (!activityDefinition) {
        return null
    }

    return (
        <Card>
            <Container $aspectRatio={{ width: 16, height: 9 }} style={{ overflow: "hidden" }}>
                <StyledImage
                    priority
                    fill
                    cloudflareId={getRaidSplash(activityId) ?? "pantheonSplash"}
                    alt={activityDefinition.name ?? ""}
                />
                <H3>{activityDefinition?.name}</H3>
            </Container>
            <div>
                <Flex $wrap $padding={0}>
                    <StatItem name="Fresh Clears" displayValue={freshClears} />
                    <StatItem name="Clears" displayValue={clears} />
                    <StatItem name="Sherpas" displayValue={sherpas} />
                </Flex>
                <div>
                    <h4>World First Race</h4>
                    <Flex $align="flex-start" $wrap $padding={0}>
                        {worldFirstEntries.map(entry => (
                            <WorldFirstEntryComponent key={entry.instanceId} {...entry} />
                        ))}
                    </Flex>
                </div>
            </div>
        </Card>
    )
}

const H3 = styled.h3`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 0.5rem;
    font-size: 1.5rem;
`

const StyledImage = styled(CloudflareImage)`
    top: -10% !important;
`

const StatItem = ({ name, displayValue }: { name: string; displayValue: number }) => (
    <StatValue>
        <div className="StatItem--Value">{displayValue}</div>
        <div className="StatItem--Name">{name}</div>
    </StatValue>
)

const StatValue = styled.div`
    text-align: center;
    padding: 0.5rem;
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 50%);

    .StatItem--Value {
        font-size: 1.5rem;
        font-weight: 600;
    }

    .StatItem--Name {
        font-size: 0.875rem;
        color: rgb(100, 100, 100);
        text-transform: uppercase;
    }
`
