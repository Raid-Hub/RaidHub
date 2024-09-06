"use client"

import Link from "next/link"
import styled from "styled-components"
import { type SVGComponent } from "~/components/SVG"
import Ammo from "~/components/icons/Ammo"
import Calendar from "~/components/icons/Calendar"
import D2CP from "~/components/icons/D2CP"
import Users from "~/components/icons/Users"
import { Flex } from "~/components/layout/Flex"
import { $media } from "../layout/media"

export const HomeToolButtons = () => {
    return (
        <Flex $crossAxis="stretch" $wrap>
            <HomeButton href="/checkpoints" title="Checkpoints" icon={D2CP} />
            <HomeButton href="/calendar" title="Rotator Calendar" icon={Calendar} />
            <HomeButton href="/clans" title="Clans" icon={Users} />
            <HomeButton href="/analytics/weapon-meta" title="Weapon Meta" icon={Ammo} />
            <HomeButton
                href="/analytics/player-population"
                title="Player Population"
                icon={Users}
            />
        </Flex>
    )
}

const HomeButton = (props: { title: string; href: string; icon: SVGComponent }) => {
    return (
        <LinkWrapper href={props.href}>
            <Flex $padding={0.5} $gap={0.5} $direction="column">
                <props.icon color="white" sx={30} />
                {props.title}
            </Flex>
        </LinkWrapper>
    )
}

const LinkWrapper = styled(Link)`
    padding: 0.5rem 1rem;
    text-align: center;

    display: flex;

    border: 1px solid color-mix(in srgb, ${props => props.theme.colors.border.dark}, #0000 60%);

    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 80%);

    color: ${({ theme }) => theme.colors.text.secondary};

    ${$media.max.mobile`
        max-width: 8rem;    
        padding: 0;
    `}

    &:hover {
        background-color: color-mix(
            in srgb,
            ${({ theme }) => theme.colors.highlight.orange},
            #0000 50%
        );
    }
`
