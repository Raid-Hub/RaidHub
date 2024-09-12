import Image from "next/image"
import styled from "styled-components"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { useRaidHubResolvePlayer } from "~/services/raidhub/useRaidHubResolvePlayers"
import { bungieProfileIconUrl, getBungieDisplayName } from "~/util/destiny"

export const SelectedPlayer = ({
    membershipId,
    removePlayer
}: {
    membershipId: string
    removePlayer: () => void
}) => {
    const { data } = useRaidHubResolvePlayer(membershipId)
    const displayName = getBungieDisplayName(
        data ?? {
            membershipId
        }
    )
    return (
        <StyledContainer>
            <Flex $align="flex-start" $wrap>
                <Image
                    src={bungieProfileIconUrl(data?.iconPath)}
                    alt={displayName}
                    unoptimized
                    width={48}
                    height={48}
                />
                <Flex $direction="column" $padding={0} $crossAxis="flex-start">
                    <div>{displayName}</div>
                </Flex>
            </Flex>
            <RemoveButton onClick={removePlayer}>✕</RemoveButton>
        </StyledContainer>
    )
}

const StyledContainer = styled(Container)`
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 50%);
`

const RemoveButton = styled.button`
    position: absolute;
    top: 2px;
    right: 2px;

    background-color: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 0.75rem;
    margin-left: auto;
    padding: 0.5rem;
    &:hover {
        color: red;
    }
`
