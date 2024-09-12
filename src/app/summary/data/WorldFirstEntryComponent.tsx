import Image from "next/image"
import styled from "styled-components"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { type RaidHubWorldFirstEntry } from "~/services/raidhub/types"
import { useRaidHubActivity } from "~/services/raidhub/useRaidHubActivity"
import { bungieProfileIconUrl } from "~/util/destiny"
import { useSelectedPlayers } from "../context"

export const WorldFirstEntryComponent = ({ instanceId, rank }: RaidHubWorldFirstEntry) => {
    const { data } = useRaidHubActivity(instanceId)
    const membershipIds = useSelectedPlayers()

    return (
        <StyledWrapper>
            <H5>#{rank}</H5>
            <Flex $wrap $direction="column" $crossAxis="flex-start" $padding={0}>
                {data?.players
                    .filter(p => p.completed)
                    .sort((a, b) => {
                        if (
                            +membershipIds.has(a.playerInfo.membershipId) ^
                            +membershipIds.has(b.playerInfo.membershipId)
                        ) {
                            return +membershipIds.has(a.playerInfo.membershipId) ? -1 : 1
                        } else {
                            return +b.isFirstClear - +a.isFirstClear
                        }
                    })
                    .map(player => {
                        const displayName =
                            player.playerInfo.bungieGlobalDisplayName ??
                            player.playerInfo.displayName ??
                            ""
                        return (
                            <Container key={player.playerInfo.membershipId}>
                                <StyledEntryPlayer
                                    $isSelectedPlayer={membershipIds.has(
                                        player.playerInfo.membershipId
                                    )}>
                                    <Image
                                        src={bungieProfileIconUrl(player.playerInfo.iconPath)}
                                        alt={displayName}
                                        unoptimized
                                        width={24}
                                        height={24}
                                    />
                                    <Flex $direction="column" $padding={0} $crossAxis="flex-start">
                                        <div>{displayName}</div>
                                    </Flex>
                                </StyledEntryPlayer>
                            </Container>
                        )
                    })}
            </Flex>
        </StyledWrapper>
    )
}

const StyledWrapper = styled(Container)`
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 50%);

    padding: 0.75rem 1.25rem;
`

const StyledEntryPlayer = styled(Flex).attrs({ $align: "flex-start", $wrap: true, $padding: 0 })<{
    $isSelectedPlayer: boolean
}>`
    ${({ $isSelectedPlayer }) => !$isSelectedPlayer && "opacity: 25%;"}
`

const H5 = styled.h5`
    font-size: 1rem;
    margin: 0 0 1em 0;
`
