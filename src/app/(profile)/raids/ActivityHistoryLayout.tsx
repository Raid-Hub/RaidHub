"use client"

import { type Collection } from "@discordjs/collection"
import Link from "next/link"
import { useMemo, useState } from "react"
import styled from "styled-components"
import { $media } from "~/app/layout/media"
import { BackgroundImage } from "~/components/BackgroundImage"
import { Card } from "~/components/Card"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { RaidSplash } from "~/data/activity-images"
import { useActivitiesByPartition } from "~/hooks/useActivitiesByPartition"
import { useAttributedRaidName } from "~/hooks/useAttributedRaidName"
import { type RaidHubPlayerActivitiesActivity } from "~/services/raidhub/types"
import { secondsToHMS } from "~/util/presentation/formatting"
import { isRaid } from "~/util/raidhub/util"
import { DotFail, DotFlawless, DotSuccess, DotTaxi } from "./constants"

export const ActivityHistoryLayout = ({
    activities,
    isLoading
}: {
    activities: Collection<string, RaidHubPlayerActivitiesActivity>
    isLoading: boolean
}) => {
    const [sections, setSections] = useState(3)
    const partitioned = useActivitiesByPartition(activities)

    const history = useMemo(
        () =>
            Array.from(partitioned)
                .slice(0, sections)
                .map(([k, activities]) => {
                    const first = activities.first()
                    if (!first) return null

                    const date = new Date(first.dateCompleted)
                    return (
                        <Container key={k} $fullWidth>
                            <h3>
                                {date.toLocaleDateString(undefined, {
                                    month: "long",
                                    year: "numeric",
                                    day: undefined
                                })}
                            </h3>
                            <Grid $fullWidth $minCardWidthMobile={175} $gap={0.85}>
                                {activities.map(a => (
                                    <Activity key={a.instanceId} {...a} />
                                ))}
                            </Grid>
                        </Container>
                    )
                }),
        [partitioned, sections]
    )

    return (
        <Flex $direction="column" $fullWidth $crossAxis="flex-start" $padding={0}>
            {history}
            <Flex $fullWidth $padding={1}>
                <Card
                    role="button"
                    $color="light"
                    aria-disabled={isLoading}
                    onClick={() => !isLoading && setSections(old => old + 1)}
                    style={{
                        padding: "1rem",
                        cursor: "pointer",
                        color: isLoading ? "gray" : undefined
                    }}>
                    Load More
                </Card>
            </Flex>
        </Flex>
    )
}

const Activity = (activity: RaidHubPlayerActivitiesActivity) => {
    const raidName = useAttributedRaidName(
        {
            raid: activity.meta.activityId,
            playerCount: activity.playerCount,
            fresh: activity.fresh,
            flawless: activity.flawless,
            difficulty: activity.meta.versionId,
            contest: activity.contest,
            completed: activity.completed
        },
        {
            includeFresh: false,
            excludeRaidName: false
        }
    )
    return (
        <ActivityCard
            href={`/pgcr/${activity.instanceId}`}
            $completed={activity.completed}
            $flawless={!!activity.flawless}
            $playerFinished={activity.player.completed}>
            <Flex $direction="column">
                <RaidTitle>{raidName}</RaidTitle>
                <RaidDuration>{secondsToHMS(activity.duration, false)}</RaidDuration>
            </Flex>
            <BackgroundImage
                cloudflareId={
                    isRaid(activity.meta.activityId)
                        ? RaidSplash[activity.meta.activityId]
                        : "pantheonSplash"
                }
                alt=""
                brightness={0.75}
                blur={1}
            />
        </ActivityCard>
    )
}

const ActivityCard = styled(Card).attrs({
    as: Link
})<{
    $completed: boolean
    $playerFinished: boolean
    $flawless: boolean
}>`
    color: unset;
    position: relative;
    aspect-ratio: 16 / 9;
    transition: transform 0.2s, filter 0.2s;
    &:hover {
        transform: scale(1.035);
        filter: brightness(1.25);
    }

    cursor: pointer;
    text-align: center;
    border: 2px solid;
    border-color: color-mix(
        in srgb,
        ${({ $completed, $playerFinished, $flawless }) =>
            $playerFinished
                ? $flawless
                    ? DotFlawless
                    : DotSuccess
                : $completed
                ? DotTaxi
                : DotFail},
        #0000 20%
    );
`

ActivityCard.defaultProps = {
    $fullWidth: false,
    $overflowHidden: true,
    $borderRadius: 10,
    $opacity: 75,
    $color: "dark"
}

const RaidTitle = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.5rem;
    ${$media.max.mobile`
        font-size: 1rem;
    `}
    font-weight: 600;

    text-shadow: 1px 1px 2px black;
`

const RaidDuration = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 1.25rem;
    ${$media.max.mobile`
        font-size: 0.875rem;
    `}
    font-weight: 500;

    text-shadow: 1px 1px 2px black;
`
