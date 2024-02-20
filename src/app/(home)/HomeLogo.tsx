"use client"

import Image from "next/image"
import styled from "styled-components"
import { Flex } from "~/components/layout/Flex"
import { $media } from "~/layout/media"

export const HomeLogo = () => {
    return (
        <Container>
            <BackgroundLogo src="/logo.png" alt="logo" width={70} height={70} />
            <TextLogo>
                Raid<TextLogoGlow>Hub</TextLogoGlow>
            </TextLogo>
        </Container>
    )
}

const Container = styled(Flex)`
    margin: 1em;
`

const BackgroundLogo = styled(Image)`
    position: absolute;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.1;
    width: 10rem;
    height: 10rem;

    ${$media.max.tablet`
        width: 8rem;
        height: 8rem;
    `}

    ${$media.max.mobile`
        width: 6rem;
        height: 6rem;
    `}

    ${$media.max.tiny`
        width: 4.5rem;
        height: 4.5rem;
    `}
`

const TextLogo = styled.h1`
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 4rem;
    font-weight: 800;
    color: ${props => props.theme.colors.text.white};
    white-space: nowrap;

    ${$media.max.tablet`
        font-size: 3rem;
    `}

    ${$media.max.mobile`
        font-size: 2rem;
    `}

    ${$media.max.tiny`
        font-size: 1.5rem;
    `}
`

const TextLogoGlow = styled.span`
    color: ${props => props.theme.colors.brand.primary};
    text-shadow: 0 0 3rem ${props => props.theme.colors.brand.primary};
`
