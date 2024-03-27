"use client"

import styled, { css, keyframes } from "styled-components"
import { useLocale } from "~/app/layout/managers/LocaleManager"
import { $media } from "~/app/layout/media"
import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import type DestinyPGCRPlayer from "~/app/pgcr/models/Player"
import { BackgroundImage } from "~/components/BackgroundImage"
import type { SVGComponent } from "~/components/SVG"
import Assist from "~/components/icons/Assist"
import Death from "~/components/icons/Death"
import Kill from "~/components/icons/Kill"
import Sparkle from "~/components/icons/Sparkle"
import Xmark from "~/components/icons/Xmark"
import { Flex } from "~/components/layout/Flex"
import { useItemDefinition } from "~/hooks/dexie"
import { bungieBannerEmblemUrl } from "~/util/destiny"
import { getBungieDisplayName } from "~/util/destiny/getBungieDisplayName"
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
    const { activity, players } = usePGCRContext()
    const activityPlayer = players?.get(player.membershipId)

    const isFirstClear =
        !!activityPlayer?.data?.isFirstClear && !!activity?.players.some(p => p.data.sherpas > 0)
    const isGoldCarry =
        activityPlayer && activity
            ? activityPlayer.data.sherpas / (Math.max(activity.playerCount, 6) - 1) >= 1 ||
              (activity.playerCount <= 3 && activityPlayer.data.sherpas > 0)
            : false
    const isSilverCarry =
        activityPlayer && activity
            ? activityPlayer.data.sherpas / (Math.max(activity.playerCount, 6) - 2) >= 1
            : false

    const firstCharacter = player.firstCharacter()

    const displayName = getBungieDisplayName(
        {
            membershipId: player.membershipId,
            displayName:
                player.firstCharacter().destinyUserInfo.displayName || activityPlayer?.displayName,
            bungieGlobalDisplayName:
                player.firstCharacter().destinyUserInfo.bungieGlobalDisplayName ||
                activityPlayer?.bungieGlobalDisplayName,
            bungieGlobalDisplayNameCode:
                player.firstCharacter().destinyUserInfo.bungieGlobalDisplayNameCode ??
                activityPlayer?.bungieGlobalDisplayNameCode
        },
        {
            excludeCode: true
        }
    )
    const emblem = useItemDefinition(firstCharacter.emblemHash)

    return (
        <SpecialBorder
            $firstClear={isFirstClear}
            $goldCarry={isGoldCarry}
            $silverCarry={isSilverCarry}>
            <StyledTab
                $relative
                $align="space-between"
                $crossAxis="stretch"
                $padding={0.5}
                $dnf={!player.completed}
                $firstClear={isFirstClear}
                onClick={onClick}>
                <BackgroundImage
                    brightness={0.8}
                    opacity={0.9}
                    src={bungieBannerEmblemUrl(emblem)}
                    alt={emblem?.displayProperties.name ?? ""}
                />

                <CharacterLogoStack
                    characters={player.characters}
                    style={{ flex: 1, justifyContent: "flex-start" }}
                />
                <Flex style={{ flex: 3, maxWidth: "50%" }}>
                    <DisplayName
                        membershipId={player.membershipId}
                        membershipType={activityPlayer?.membershipType ?? 0}
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
                            <StatValue name="assists" value={player.values.assists} Icon={Assist} />
                            <StatValue name="deaths" value={player.values.deaths} Icon={Death} />
                        </Flex>
                    )}
                </Flex>
            </StyledTab>
        </SpecialBorder>
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

const borderThickness = 5
const StyledTab = styled(Flex)<{ $dnf: boolean; $firstClear: boolean }>`
    cursor: pointer;

    clip-path: inset(
        ${borderThickness / 1.5}px ${borderThickness / 1.5}px ${borderThickness / 1.5}px
            ${borderThickness / 1.5}px round ${borderThickness / 2}px
    );

    min-height: 90px;
    ${$media.max.mobile`
        min-height: 60px;
    `}

    ${props => props.$dnf && `filter: grayscale(75%)  brightness(0.3);`}
`

const borderAnimation = keyframes`
    0% {
        background-position: top 0% left, bottom 0% right, right 33.3% top, left 33.3% bottom, top;
    }
    100% {
        background-position: top 66.7% left, bottom 66.7% right, right 100% top, left 100% bottom, top;
    }`

const SpecialBorder = styled.div<{
    $firstClear: boolean
    $goldCarry: boolean
    $silverCarry: boolean
}>`
    z-index: 1;
    transition: transform 0.1s ease-in-out;
    &:hover {
        transform: scale(1.025);
        z-index: 2;
    }

    border-radius: 6px;
    ${props => {
        if (props.$firstClear || props.$goldCarry || props.$silverCarry) {
            const shimmer = props.$firstClear
                ? "rgba(150, 255, 160, 0.9)" // green
                : props.$goldCarry
                ? "rgba(255, 223, 145, 0.9)" // gold
                : "rgba(218, 221, 224, 0.9)" // silver
            const background = props.$firstClear
                ? "rgba(77, 176, 86, 0.5)" // dark green
                : props.$goldCarry
                ? "rgba(212, 182, 108, 0.5)" // dark gold
                : "rgba(163, 163, 163, 0.5)" // dark silver
            const gradient = `transparent, transparent 7%, ${shimmer} 15%, transparent 23%, transparent 57%, ${shimmer} 65%, transparent 73%, transparent`
            return css`
                background: linear-gradient(to bottom, ${gradient}),
                    linear-gradient(to top, ${gradient}), linear-gradient(to left, ${gradient}),
                    linear-gradient(to right, ${gradient}), ${background};
                background-size: ${borderThickness}px 400%, ${borderThickness}px 400%,
                    400% ${borderThickness}px, 400% ${borderThickness}px, 100% 100%;
                animation: ${borderAnimation} 1.5s linear infinite;
            `
        } else {
            return css`
                background-color: color-mix(
                    in srgb,
                    ${({ theme }) => theme.colors.border.dark},
                    #0000 60%
                );
            `
        }
    }}
    background-repeat: no-repeat;
`

const KDAStat = styled(Flex)`
    user-select: none;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;

    color: ${({ theme }) => theme.colors.text.primary};

    font-size: 1.125rem;
    ${$media.max.mobile`
        font-size: 0.75rem;
    `}
`
