"use client"

import Image from "next/image"
import { type ReactNode } from "react"
import styled from "styled-components"
import { Card } from "~/components/Card"
import { Flex } from "~/components/layout/Flex"
import { CardSplash, CardSplashTitleAbsolute } from "./CheckpointCardSplash"

export const CheckpointCard = (props: {
    title: string
    encounter: string
    encounterImageUrl: string
    encounterImageAlt: string
    children: ReactNode
}) => (
    <Card>
        <CardSplash>
            <Image
                unoptimized
                src={props.encounterImageUrl}
                alt={props.encounterImageAlt}
                width={640}
                height={360}
                objectFit="cover"
            />
            <CardSplashTitleAbsolute>
                {props.title
                    .toLowerCase()
                    .replaceAll("normal", "")
                    .replaceAll("master", "")
                    .replaceAll(":", "")}
            </CardSplashTitleAbsolute>
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
