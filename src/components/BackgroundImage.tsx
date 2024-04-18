import Image from "next/image"
import styled, { css, type CSSProperties } from "styled-components"
import { CloudflareImage, type CloudflareImageId } from "./CloudflareImage"

type CommonBackgroundImageProps = {
    fit?: "contain" | "cover" | "fill"
    position?: string
    alt: string
    opacity?: number
    style?: CSSProperties
    radius?: number
    brightness?: number
    blur?: number
}

export const BackgroundImage = (
    props: CommonBackgroundImageProps &
        (
            | {
                  src: string
              }
            | {
                  cloudflareId: CloudflareImageId
              }
        )
) => {
    return "src" in props ? (
        <StyledImage
            $fit={props.fit}
            $objectPosition={props.position}
            $opacity={props.opacity}
            $borderRadius={props.radius}
            $brightness={props.brightness}
            $blur={props.blur}
            alt={props.alt}
            style={props.style}
            unoptimized
            fill
            src={props.src}
        />
    ) : (
        <StyledCloudflareImage
            cloudflareId={props.cloudflareId}
            fill
            $fit={props.fit}
            $objectPosition={props.position}
            style={props.style}
            $opacity={props.opacity}
            $borderRadius={props.radius}
            $brightness={props.brightness}
            $blur={props.blur}
            alt={props.alt}
        />
    )
}

type Props = {
    $fit?: "contain" | "cover" | "fill"
    $opacity?: number
    $objectPosition?: string
    $borderRadius?: number
    $brightness?: number
    $blur?: number
}

const defaultProps: Props = {
    $borderRadius: 0,
    $fit: "cover",
    $objectPosition: "50% 50%",
    $opacity: 0.75,
    $brightness: 1,
    $blur: 0
}

const style = css<Props>`
    ${props => css`
        z-index: -1;
        border-radius: ${props.$borderRadius}px;
        object-fit: ${props.$fit};
        object-position: ${props.$objectPosition};
        opacity: ${props.$opacity};
        filter: brightness(${props.$brightness}) blur(${props.$blur}px);
        -webkit-filter: brightness(${props.$brightness}) blur(${props.$blur}px);
    `}
`

const StyledImage = styled(Image)<Props>`
    ${style}
`
StyledImage.defaultProps = defaultProps

const StyledCloudflareImage = styled(CloudflareImage)<Props>`
    ${style}
`

StyledCloudflareImage.defaultProps = defaultProps
