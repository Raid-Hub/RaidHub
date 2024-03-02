"use client"

import Link from "next/link"
import styled, { css } from "styled-components"
import { BackgroundImage } from "~/components/BackgroundImage"
import { Panel } from "~/components/Panel"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"
import { Flex } from "~/components/layout/Flex"
import { H4 } from "~/components/typography/H4"
import { $media } from "~/layout/media"

export const Splash = (props: {
    title: string
    subtitle?: string
    tertiaryTitle: string
    cloudflareImageId: string
}) => (
    <Panel>
        <Flex $direction="column" $gap={0}>
            <H4 $mBlock={0.25}>{props.tertiaryTitle}</H4>
            <Title>{props.title}</Title>
            {props.subtitle && <Subtitle>{props.subtitle}</Subtitle>}
        </Flex>
        <BackgroundImage cloudflareId={props.cloudflareImageId} alt={props.title} />
    </Panel>
)

const shadow = css`
    text-shadow: 3px 0px 7px rgba(81, 67, 21, 0.8), -3px 0px 7px rgba(81, 67, 21, 0.8),
        0px 4px 7px rgba(81, 67, 21, 0.8);
`

const Title = styled.h1`
    ${shadow}
    font-size: 2rem;
    ${$media.min.desktop`
        font-size: 3rem;
    `}
    margin-block: 0;
`

const Subtitle = styled.div`
    ${shadow}
    font-size: 1.75rem;
    ${$media.min.desktop`
        font-size: 2.75rem;
    `}
`
export const TooltipWrapper = ({
    id,
    title,
    children
}: {
    title: string
    id: string
    children: JSX.Element
}) => (
    <TooltipContainer tooltipId={id} tooltipBody={<TooltipData $mb={0.5}>{title}</TooltipData>}>
        {children}
    </TooltipContainer>
)

export const ExtLink = styled(Link).attrs({ target: "_blank" })`
    display: flex;
`
