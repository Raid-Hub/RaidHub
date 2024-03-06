"use client"

import { type ReactNode } from "react"
import styled from "styled-components"
import { Card } from "~/components/Card"
import { CloudflareImage } from "~/components/CloudflareImage"
import { Flex } from "~/components/layout/Flex"
import { CardSplash, CardSplashTitleAbsolute } from "./splash/HomeCardSplash"

export const HomeCardGeneric = (props: {
    id: string
    title: string
    backgroundImageCloudflareId: string
    backgroundImageAltText: string
    children: ReactNode
}) => (
    <Card id={props.id}>
        <CardSplash>
            <CloudflareImage
                priority
                width={640}
                height={360}
                cloudflareId={props.backgroundImageCloudflareId}
                alt={props.backgroundImageAltText}
            />
            <CardSplashTitleAbsolute>{props.title}</CardSplashTitleAbsolute>
        </CardSplash>
        <CardContent $direction="column" $gap={0.75} $crossAxis="stretch">
            {props.children}
        </CardContent>
    </Card>
)

const CardContent = styled(Flex)`
    padding: 0.5em 1em;
    & hr {
        border-color: ${({ theme }) => theme.colors.border.medium};
    }
`
