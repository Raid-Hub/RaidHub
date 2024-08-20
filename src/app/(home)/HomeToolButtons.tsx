"use client"

import Link from "next/link"
import styled from "styled-components"
import { type SVGComponent } from "~/components/SVG"
import Calendar from "~/components/icons/Calendar"
import D2CP from "~/components/icons/D2CP"
import Users from "~/components/icons/Users"
import { Flex } from "~/components/layout/Flex"

export const HomeToolButtons = () => {
    return (
        <Flex>
            <HomeButton href="/checkpoints" title="Checkpoints" icon={D2CP} />
            <HomeButton href="/calendar" title="Rotator Calendar" icon={Calendar} />
            <HomeButton href="/clans" title="Clans" icon={Users} />
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
    border-radius: 0.5em;
    padding: 0.5em;

    border: 1px solid color-mix(in srgb, ${props => props.theme.colors.border.dark}, #0000 60%);

    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 80%);

    color: ${({ theme }) => theme.colors.text.secondary};

    &:hover {
        background-color: color-mix(
            in srgb,
            ${({ theme }) => theme.colors.highlight.orange},
            #0000 50%
        );
    }
`
