import type { BungieMembershipType } from "bungie-net-core/models"
import Link from "next/link"
import styled from "styled-components"
import ExternalLink from "~/components/icons/ExternalLink"
import { $media } from "~/layout/media"

export const DisplayName = (props: {
    displayName: string
    membershipId: string
    membershipType: BungieMembershipType
}) => (
    <StyledDisplayName
        onClick={e => e.stopPropagation()}
        href={`/profile/${props.membershipType}/${props.membershipId}`}>
        {props.displayName}
        <ExternalLink
            sx={24}
            color="white"
            data-player={props.membershipId}
            style={{
                position: "absolute",
                right: "-2rem",
                top: "50%",
                transform: "translateY(-50%)"
            }}
        />
    </StyledDisplayName>
)

const StyledDisplayName = styled(Link)`
    font-size: 1.5rem;
    ${$media.max.mobile`
        font-size: 1.125rem;
    `}
    text-align: center;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    text-shadow: 2px 2px 3px ${({ theme }) => theme.colors.background.dark};

    position: relative;

    & *[data-player] {
        opacity: 0;
        transition: opacity 0.15s ease-in-out;
    }

    &:hover *[data-player] {
        opacity: 1;
    }
`
