"use client"

import Link from "next/link"
import styled from "styled-components"
import Search from "~/components/icons/Search"
import { Flex } from "~/components/layout/Flex"

export const HomeToolButtons = () => {
    return (
        <Flex>
            <HomeButton href="/calendar" title="Rotator Calendar" />
        </Flex>
    )
}

const HomeButton = (props: { title: string; href: string }) => {
    return (
        <LinkWrapper href={props.href}>
            <Flex $padding={0.5} $gap={0.5} $direction="column">
                <Search color="white" sx={30} />
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
