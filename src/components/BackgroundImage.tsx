import Image from "next/image"
import styled, { css, type CSSProperties } from "styled-components"
import { CloudflareImage } from "./CloudflareImage"

type CommonBackgroundImageProps = {
    fit?: "contain" | "cover" | "fill"
    position?: string
    alt: string
    opacity?: number
    style?: CSSProperties
    radius?: number
    brightness?: number
}

export const BackgroundImage = (
    props: CommonBackgroundImageProps &
        (
            | {
                  src: string
              }
            | {
                  cloudflareId: string
              }
        )
) => {
    return (
        // @ts-expect-error missing src
        <StyledImage
            $fit={props.fit}
            $objectPosition={props.position}
            alt={props.alt}
            style={props.style}
            unoptimized
            fill
            $opacity={props.opacity}
            $borderRadius={props.radius}
            $brightness={props.brightness}
            {...("src" in props
                ? {
                      src: props.src
                  }
                : {
                      as: CloudflareImage,
                      cloudflareId: props.cloudflareId
                  })}
        />
    )
}

type Props = {
    $fit?: "contain" | "cover" | "fill"
    $opacity?: number
    $objectPosition?: string
    $borderRadius?: number
    $brightness?: number
}

const StyledImage = styled(Image)<Props>`
    z-index: -1;
    ${props => css`
        border-radius: ${props.$borderRadius}px;
        object-fit: ${props.$fit};
        object-position: ${props.$objectPosition};
        opacity: ${props.$opacity};
        filter: brightness(${props.$brightness});
    `}
`

StyledImage.defaultProps = {
    $borderRadius: 0,
    $fit: "cover",
    $objectPosition: "50% 50%",
    $opacity: 0.75,
    $brightness: 1
}
