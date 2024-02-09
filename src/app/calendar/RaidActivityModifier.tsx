"use client"

import Image from "next/image"
import { useState } from "react"
import styled from "styled-components"
import { Flex } from "~/components/layout/Flex"
import { useActivityModifierDefinition } from "~/hooks/dexie/useActivityModifierDefinition"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"

export const RaidActivityModifier = (props: { hash: number }) => {
    const [isHovered, setIsHovered] = useState(false)
    const definition = useActivityModifierDefinition(props.hash)
    const tooltipId = `tooltip-${props.hash}`

    return definition?.displayProperties.hasIcon ? (
        <Container
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}>
            <Flex data-modifier-hash={props.hash} $direction="column" $padding={0.3} $gap={0.5}>
                {isHovered && (
                    <ModifierNameTooltip id={tooltipId} role="tooltip">
                        {definition.displayProperties.name}
                    </ModifierNameTooltip>
                )}
                <Image
                    unoptimized
                    alt={definition.displayProperties.name}
                    src={bungieIconUrl(definition.displayProperties.icon)}
                    width={40}
                    height={40}
                    aria-describedby={tooltipId}
                />
            </Flex>
        </Container>
    ) : null
}

const Container = styled.div`
    position: relative;
`

const ModifierNameTooltip = styled.div`
    position: absolute;
    bottom: 100%;

    font-size: 0.875rem;
    text-align: center;

    width: max-content;

    padding: 0.3em 0.5em;
    border-radius: 0.3em;
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 10%);
`
