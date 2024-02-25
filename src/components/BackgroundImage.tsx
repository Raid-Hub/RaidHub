import Image from "next/image"
import styled, { type CSSProperties } from "styled-components"
import { CloudflareImage } from "./CloudflareImage"

type CommonBackgroundImageProps = {
    fit?: "contain" | "cover" | "fill"
    position?: string
    alt: string
    opacity?: number
    style?: CSSProperties
}

export const BackgroundImage = (
    props: CommonBackgroundImageProps & {
        src: string
    }
) => {
    return (
        <StyledImage
            src={props.src}
            $fit={props.fit}
            $objectPosition={props.position}
            alt={props.alt}
            style={props.style}
            unoptimized
            fill
            $opacity={props.opacity}
        />
    )
}

export const CloudlfareBackgroundImage = (
    props: CommonBackgroundImageProps & { cloudflareId: string }
) => {
    return (
        <StyledCloudflareImage
            cloudflareId={props.cloudflareId}
            $fit={props.fit}
            $objectPosition={props.position}
            alt={props.alt}
            fill
            $opacity={props.opacity}
        />
    )
}

type Props = {
    $fit?: "contain" | "cover" | "fill"
    $opacity?: number
    $objectPosition?: string
}

const StyledCloudflareImage = styled(CloudflareImage)<Props>`
    z-index: -1;
    object-position: ${props => props.$objectPosition};
    object-fit: ${props => props.$fit};
    opacity: ${props => props.$opacity};
`
const defaultProps: Props = {
    $fit: "cover",
    $opacity: 0.75,
    $objectPosition: "50% 50%"
}

StyledCloudflareImage.defaultProps = defaultProps

const StyledImage = styled(Image)<Props>`
    z-index: -1;
    object-position: ${props => props.$objectPosition};
    object-fit: ${props => props.$fit};
    opacity: ${props => props.$opacity};
`

StyledImage.defaultProps = defaultProps
