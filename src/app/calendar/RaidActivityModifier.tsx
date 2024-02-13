"use client"

import { DestinyActivityModifierDefinition } from "bungie-net-core/models"
import Image from "next/image"
import styled from "styled-components"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"
import { Flex } from "~/components/layout/Flex"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"

export const RaidActivityModifier = (props: { modifier: DestinyActivityModifierDefinition }) => {
    return (
        <TooltipContainer
            tooltipId={`tooltip-${props.modifier.hash}`}
            tooltipBody={
                <TooltipData>
                    <Flex $direction="column" $gap={0} $padding={0.6}>
                        <H5>
                            <b>{props.modifier.displayProperties.name}</b>
                        </H5>
                        <div>
                            {props.modifier.displayProperties.description
                                .replace(/\{var:\d+\}%/, "25%")
                                .replace(/\{var:\d+\}/, "unknown")}
                        </div>
                    </Flex>
                </TooltipData>
            }>
            <Flex
                data-modifier-hash={props.modifier.hash}
                $direction="column"
                $padding={0.3}
                $gap={0.5}>
                <Image
                    unoptimized
                    alt={props.modifier.displayProperties.name}
                    src={bungieIconUrl(props.modifier.displayProperties.icon)}
                    width={40}
                    height={40}
                />
            </Flex>
        </TooltipContainer>
    )
}

const H5 = styled.h5`
    margin-block: 0.2em;

    font-size: 1rem;
`
