"use client"

import styled from "styled-components"
import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import type DestinyPGCRPlayer from "~/app/pgcr/models/Player"
import { BackgroundImage } from "~/components/BackgroundImage"
import type { SVGComponent } from "~/components/SVG"
import Death from "~/components/icons/Death"
import Kill from "~/components/icons/Kill"
import Sparkle from "~/components/icons/Sparkle"
import SplitHeart from "~/components/icons/SplitHeart"
import Xmark from "~/components/icons/Xmark"
import { Flex } from "~/components/layout/Flex"
import { useItemDefinition } from "~/hooks/dexie"
import { useLocale } from "~/layout/managers/LocaleManager"
import { $media } from "~/layout/media"
import { useRaidHubResolvePlayer } from "~/services/raidhub/useRaidHubResolvePlayers"
import type { RaidHubPlayerBasicResponse } from "~/types/raidhub-api"
import { bungieBannerEmblemUrl } from "~/util/destiny/bungie-icons"
import { getUserName } from "~/util/destiny/bungieName"
import { formattedNumber } from "~/util/presentation/formatting"
import { CharacterLogoStack } from "./CharacterLogoStack"
import { DisplayName } from "./DisplayName"

export const PlayerTab = ({
    player,
    onClick
}: {
    player: DestinyPGCRPlayer
    onClick: () => void
}) => {
    const { activity, pgcrPlayers } = usePGCRContext()

    const firstCharacter = player.firstCharacter()

    const membershipId = player.membershipId
    const shouldResolve = !player.membershipType && !!pgcrPlayers && pgcrPlayers.size < 15
    const { data: resolvedPlayer, isSuccess } = useRaidHubResolvePlayer(player.membershipId, {
        enabled: shouldResolve,
        placeholderData: {
            membershipId: player.membershipId,
            membershipType: player.membershipType,
            displayName: firstCharacter.destinyUserInfo.displayName,
            bungieGlobalDisplayName: firstCharacter.destinyUserInfo.bungieGlobalDisplayName ?? null,
            bungieGlobalDisplayNameCode: firstCharacter.destinyUserInfo.bungieGlobalDisplayNameCode
                ? String(firstCharacter.destinyUserInfo.bungieGlobalDisplayNameCode).padStart(
                      4,
                      "0"
                  )
                : null
        } as RaidHubPlayerBasicResponse
    })

    const displayName = getUserName(resolvedPlayer!, {
        excludeCode: true
    })

    const emblem = useItemDefinition(firstCharacter.emblemHash)

    return (
        <StyledTab
            $relative
            $align="space-between"
            $crossAxis="stretch"
            $padding={0.5}
            $dnf={!player.completed}
            onClick={onClick}>
            <BackgroundImage
                opacity={0.9}
                src={bungieBannerEmblemUrl(emblem)}
                alt={emblem?.displayProperties.name ?? ""}
            />

            <CharacterLogoStack
                characters={player.characters}
                style={{ flex: 1, justifyContent: "flex-start" }}
            />
            <Flex style={{ flex: 3 }}>
                <DisplayName
                    membershipId={membershipId}
                    membershipType={resolvedPlayer!.membershipType}
                    displayName={displayName}
                />
            </Flex>
            <Flex $padding={0} style={{ flex: 1 }} $align="flex-end">
                {activity?.playerCount === 1 ? (
                    activity.completed ? (
                        <Sparkle sx={50} color="white" />
                    ) : (
                        <Xmark sx={50} color="white" />
                    )
                ) : (
                    <Flex $direction="column" $align="space-around" $padding={0} $gap={0.25}>
                        <StatValue name="kills" value={player.values.kills} Icon={Kill} />
                        <StatValue name="assists" value={player.values.assists} Icon={SplitHeart} />
                        <StatValue name="deaths" value={player.values.deaths} Icon={Death} />
                    </Flex>
                )}
            </Flex>
        </StyledTab>
    )
}

const StatValue = (props: { name: string; value: number; Icon: SVGComponent }) => {
    const { locale } = useLocale()
    return (
        <KDAStat
            $direction="row"
            $align="flex-start"
            $fullWidth
            $padding={0}
            $gap={0.5}
            $paddingX={0.3}>
            <div>
                <props.Icon sx={12} color="white" />
            </div>
            <div>{formattedNumber(props.value, locale)}</div>
        </KDAStat>
    )
}

const StyledTab = styled(Flex)<{ $dnf: boolean }>`
    cursor: pointer;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border.dark};

    transition: transform 0.1s ease-in-out;
    &:hover {
        transform: scale(1.025);
        z-index: 2;
    }

    min-height: 90px;
    ${$media.max.mobile`
        min-height: 70px;
    `}

    ${props => props.$dnf && `filter: grayscale(75%)  brightness(0.3);`}
`

const KDAStat = styled(Flex)`
    user-select: none;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;

    color: ${({ theme }) => theme.colors.text.primary};

    font-size: 1.125rem;
    ${$media.max.mobile`
        font-size: 0.875rem;
    `}
`
