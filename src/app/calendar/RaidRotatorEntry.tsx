"use client"

import { DestinyPublicMilestone } from "bungie-net-core/models"
import { Fragment } from "react"
import styled from "styled-components"
import { useLocale } from "~/app/managers/LocaleManager"
import { useRaidHubManifest } from "~/app/managers/RaidHubManifestManager"
import { BackgroundImage } from "~/components/BackgroundImage"
import { Flex } from "~/components/layout/Flex"
import RaidCardBackground from "~/data/raid-backgrounds"
import { RaidActivity } from "./RaidActivity"

export const RaidRotatorEntry = (props: {
    milestone: DestinyPublicMilestone
    startDate: Date
    endDate: Date
    children?: React.ReactNode
}) => {
    const { locale } = useLocale()
    const { getRaidFromHash, getRaidString } = useRaidHubManifest()
    const a = getRaidFromHash(props.milestone.activities[0].activityHash)
    const raidName = a?.raid && getRaidString(a?.raid)

    if (!raidName) return null

    return (
        <Main>
            <Flex $direction="column" $gap={0.2}>
                <RaidTitle>{raidName}</RaidTitle>
                <RotatorDates>
                    {props.startDate.toLocaleDateString(locale, { month: "long", day: "numeric" })}
                    {props.startDate.getMonth() === props.endDate.getMonth()
                        ? ` - ${props.endDate.toLocaleDateString(locale, { day: "numeric" })}`
                        : ` - ${props.endDate.toLocaleDateString(locale, {
                              month: "long",
                              day: "numeric"
                          })}`}
                </RotatorDates>
            </Flex>
            {props.children}
            <BackgroundImage
                cloudflareId={RaidCardBackground[a.raid]}
                alt={raidName}
                opacity={0.65}
            />
        </Main>
    )
}

const RotatorDates = styled.div`
    font-size: 1rem;
    font-weight: 500;
    font-style: italic;
    text-shadow: 0 0 2px #000;
`

export const FeaturedRaidRotatorEntry = (props: {
    milestone: DestinyPublicMilestone
    startDate: Date
    endDate: Date
}) => {
    const { getRaidFromHash, getDifficultyString } = useRaidHubManifest()
    return (
        <RaidRotatorEntry {...props}>
            <Container>
                <Flex $direction="column" $gap={0.3}>
                    {props.milestone.activities.map(activity => {
                        const definition = getRaidFromHash(activity.activityHash)
                        return (
                            <Fragment key={activity.activityHash}>
                                {definition && (
                                    <RaidActivity
                                        activity={activity}
                                        version={getDifficultyString(definition.difficulty)}
                                    />
                                )}
                            </Fragment>
                        )
                    })}
                </Flex>
            </Container>
        </RaidRotatorEntry>
    )
}

const Main = styled.div`
    position: relative;
    width: 100%;
    background-color: color-mix(in srgb, ${p => p.theme.colors.background.dark}, #0000 50%);

    border-radius: 0.5rem;
    border: 1px solid color-mix(in srgb, ${p => p.theme.colors.border.dark}, #0000 60%);
`

const Container = styled.div`
    width: 100%;
`

const RaidTitle = styled.h3`
    font-size: 1.5rem;
    margin-block: 0.2em;
`
