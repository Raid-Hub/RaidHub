import styled from "styled-components"
import { CloudflareImage } from "./CloudflareImage"

export const BackgroundImage = (props: {
    cloudflareId: string
    fit?: "contain" | "cover" | "fill"
    alt: string
    opacity?: number
}) => {
    return (
        <StyledImage
            cloudflareId={props.cloudflareId}
            $fit={props.fit}
            alt={props.alt}
            fill
            $opacity={props.opacity}
        />
    )
}

const StyledImage = styled(CloudflareImage)<{
    $fit?: "contain" | "cover" | "fill"
    $opacity?: number
}>`
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: ${props => props.$fit};
    opacity: ${props => props.$opacity};
`

StyledImage.defaultProps = {
    $fit: "cover",
    $opacity: 0.5
}
