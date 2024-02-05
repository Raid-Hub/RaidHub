"use client"

import styled from "styled-components"
import { CloudflareImage } from "~/components/CloudflareImage"
import { Flex } from "~/components/layout/Flex"
import { ReactChildren } from "~/types/generic"
import { HomeCardContentSection } from "./content/HomeCardContentSection"
import { CardSplash, CardSplashTitleAbsolute } from "./splash/HomeCardSplash"

export const HomeCardGeneric = (props: {
    id: string
    title: string
    backgroundImageCloudflareId: string
    backgroundImageAltText: string
    children: ReactChildren<typeof HomeCardContentSection>
}) => {
    return (
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
}

const Card = styled.div`
    background-color: color-mix(
        in srgb,
        ${props => props.theme.colors.background.medium},
        #0000 75%
    );
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, ${props => props.theme.colors.border.dark}, #0000 60%);
`
const CardContent = styled(Flex)`
    padding: 0.5em 1em;
    & hr {
        border-color: ${({ theme }) => theme.colors.border.medium};
    }
`
