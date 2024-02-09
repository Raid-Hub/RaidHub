"use client"

import Link from "next/link"
import { Fragment, ReactNode } from "react"
import styled from "styled-components"
import { SVGComponent } from "~/components/SVG"
import DiscordIcon from "~/components/icons/DiscordIcon"
import Email from "~/components/icons/Email"
import TwitterIcon from "~/components/icons/TwitterIcon"
import { Flex } from "~/components/layout/Flex"

import manifest from "../../../public/manifest.json"

const developers: [display: string, path: string][] = [
    ["Newo", "newo"],
    ["Sam", "sam"],
    ["Theos", "theos"]
]

const contactIcons: { url: string; Icon: SVGComponent }[] = [
    {
        url: `https://discord.gg/raidhub`,
        Icon: DiscordIcon
    },
    {
        url: "https://www.twitter.com/raidhubio",
        Icon: TwitterIcon
    },
    {
        url: `mailto:admin@raidhub.io`,
        Icon: Email
    }
]

export const Footer = () => {
    return (
        <FooterStyled id="footer">
            <Flex $align="space-between" $padding={1}>
                <FooterSide side="left">
                    <div>
                        <DevelopedBy>Developed by</DevelopedBy>
                        <div>
                            {developers.map(([display, path], idx) => (
                                <Fragment key={idx}>
                                    <Developer href={`/${path}`}>{display}</Developer>
                                    {idx !== developers.length - 1 && <span>{", "}</span>}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    <div>
                        RaidHub <Version>alpha-{manifest.version}</Version>
                    </div>
                </FooterSide>
                <FooterSide side="right">
                    <Flex $padding={0}>
                        {contactIcons.map(({ url, Icon }, key) => (
                            <Link key={key} href={url} target="_blank" rel="noopener noreferrer">
                                <Icon sx={30} color="gray" hoverColor="lightGray" />
                            </Link>
                        ))}
                    </Flex>
                    <Flex $padding={0} $gap={0.35}>
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/terms">Terms</Link>
                    </Flex>
                </FooterSide>
            </Flex>
        </FooterStyled>
    )
}

const FooterStyled = styled.footer`
    overflow: hidden;
    margin-top: auto;
    min-width: 100%;

    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 50%);

    backdrop-filter: blur(10px);
    border-top: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.border.dark}, #0000 60%);
    border-bottom: 1px solid
        color-mix(in srgb, ${({ theme }) => theme.colors.border.dark}, #0000 60%);

    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.tertiary};

    & a {
        color: ${({ theme }) => theme.colors.text.tertiary};
        &:hover {
            color: ${({ theme }) => theme.colors.text.secondary};
        }
    }
`

const FooterSide = (props: { children: ReactNode; side: "left" | "right" }) => (
    <Flex
        $direction="column"
        $align="space-between"
        $padding={0}
        $gap={0.9}
        $crossAxis={props.side === "left" ? "flex-start" : "flex-end"}>
        {props.children}
    </Flex>
)

const DevelopedBy = styled.div`
    margin-bottom: 0.2em;
`

const Developer = styled(Link)`
    font-weight: 800;
    text-transform: uppercase;
`

const Version = styled.span`
    color: ${({ theme }) => theme.colors.text.secondary};
`
