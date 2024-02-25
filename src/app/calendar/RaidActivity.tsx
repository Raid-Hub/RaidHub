"use client"

import type {
    DestinyActivityModifierDefinition,
    DestinyPublicMilestoneChallengeActivity
} from "bungie-net-core/models"
import styled from "styled-components"
import { Flex } from "~/components/layout/Flex"
import { useActivityModifierDefinitions } from "~/hooks/dexie"
import { RaidActivityModifier } from "./RaidActivityModifier"

export const RaidActivity = (props: {
    activity: DestinyPublicMilestoneChallengeActivity
    version: string
}) => {
    const modifiers = useActivityModifierDefinitions(props.activity.modifierHashes)

    return (
        <Container>
            <Flex
                $direction="column"
                $padding={0.5}
                $gap={0.2}
                data-activity-hash={props.activity.activityHash}>
                <RaidVersion>{props.version}</RaidVersion>
                <Container>
                    <Flex $padding={0.3} $wrap>
                        {modifiers
                            ?.filter(
                                (m): m is DestinyActivityModifierDefinition =>
                                    m?.displayInActivitySelection ?? false
                            )
                            .sort((a, b) => a.index - b.index)
                            .map(modifier => (
                                <RaidActivityModifier key={modifier.hash} modifier={modifier} />
                            ))}
                    </Flex>
                </Container>
            </Flex>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
`

const RaidVersion = styled.h4`
    font-size: 1.25rem;
    margin-block: 0.2em;
`
