"use client"

import type { DestinyInventoryItemDefinition } from "bungie-net-core/models"
import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"
import { BackgroundImage } from "~/components/BackgroundImage"
import { Card } from "~/components/Card"
import { TabSelector } from "~/components/TabSelector"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { H4 } from "~/components/typography/H4"
import { useClassDefinition, useItemDefinition, useItemDefinitions } from "~/hooks/dexie"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { useLocale } from "~/layout/managers/LocaleManager"
import { useRaidHubResolvePlayer } from "~/services/raidhub/useRaidHubResolvePlayers"
import type { RaidHubPlayerBasicResponse } from "~/types/raidhub-api"
import { bungieEmblemUrl, bungieIconUrl } from "~/util/destiny/bungie-icons"
import { getUserName } from "~/util/destiny/bungieName"
import { formattedNumber, secondsToHMS } from "~/util/presentation/formatting"
import { useResolveCharacter } from "../hooks/useResolveCharacter"
import type DestinyPGCRCharacter from "../models/Character"
import type DestinyPGCRPlayer from "../models/Player"
import type { PGCRPageParams } from "../types"
import { DisplayName } from "./DisplayName"

export const SelectedPlayerView = (props: {
    selectedPlayer: DestinyPGCRPlayer
    deselect: () => void
}) => {
    const { locale } = useLocale()
    const { get, remove } = useQueryParams<PGCRPageParams>()
    const selectedCharacterId = get("character")

    const selectedCharacter = selectedCharacterId
        ? props.selectedPlayer.characters.get(selectedCharacterId)
        : null

    const focusedEntry = selectedCharacter ?? props.selectedPlayer

    const firstCharacter = props.selectedPlayer.firstCharacter()
    const { data: resolvedPlayer } = useRaidHubResolvePlayer(props.selectedPlayer.membershipId, {
        enabled: props.selectedPlayer.membershipType === 0,
        placeholderData: {
            membershipId: props.selectedPlayer.membershipId,
            membershipType: props.selectedPlayer.membershipType,
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
        excludeCode: false
    })

    const emblem = useItemDefinition(selectedCharacter?.emblemHash ?? firstCharacter.emblemHash)

    const weapons = focusedEntry.weapons.map((_, hash) => hash)

    const weaponDefinitions = useItemDefinitions(weapons)

    return (
        <Flex $direction="column" $crossAxis="flex-start">
            <SelectedPlayer
                $aspectRatio={{ width: 474, height: 96 }}
                $minHeight={96}
                onClick={props.deselect}>
                <Flex $fullWidth>
                    <DisplayName
                        membershipId={props.selectedPlayer.membershipId}
                        membershipType={resolvedPlayer!.membershipType}
                        displayName={displayName}></DisplayName>
                </Flex>
                <BackgroundImage
                    style={
                        focusedEntry.completed
                            ? {}
                            : {
                                  filter: "grayscale(100%) brightness(0.5)"
                              }
                    }
                    position="left"
                    opacity={0.95}
                    src={bungieEmblemUrl(emblem)}
                    alt={emblem?.displayProperties.name ?? ""}
                />
            </SelectedPlayer>
            <Card
                $color="dark"
                $opacity={20}
                $fullWidth
                style={{ padding: "1em" }}
                $borderRadius={5}>
                {props.selectedPlayer.characters.size > 1 && (
                    <TabSelector>
                        <H4
                            $mBlock={0.2}
                            aria-selected={selectedCharacterId === null}
                            onClick={() => remove("character")}
                            style={{
                                padding: "0.5rem"
                            }}>
                            All Classes
                        </H4>
                        {props.selectedPlayer.characters.map(c => (
                            <CharacterTab key={c.characterId} character={c} />
                        ))}
                    </TabSelector>
                )}
                <H4>Stats</H4>
                <Flex $wrap $align="flex-start" $padding={0} $gap={0.5}>
                    <Stat>
                        <div>Time Played</div>
                        <div>{secondsToHMS(focusedEntry.values.timePlayedSeconds, true)}</div>
                    </Stat>
                    <Stat>
                        <div>Kills</div>
                        <div>{formattedNumber(focusedEntry.values.kills, locale)}</div>
                    </Stat>
                    <Stat>
                        <div>Assists</div>
                        <div>{formattedNumber(focusedEntry.values.assists, locale)}</div>
                    </Stat>
                    <Stat>
                        <div>Deaths</div>
                        <div>{formattedNumber(focusedEntry.values.deaths, locale)}</div>
                    </Stat>
                    <Stat>
                        <div>Precision Kills</div>
                        <div>{formattedNumber(focusedEntry.values.precisionKills, locale)}</div>
                    </Stat>
                    <Stat>
                        <div>Super Kills</div>
                        <div>{formattedNumber(focusedEntry.values.superKills, locale)}</div>
                    </Stat>
                    <Stat>
                        <div>Melee Kills</div>
                        <div>{formattedNumber(focusedEntry.values.meleeKills, locale)}</div>
                    </Stat>
                    <Stat>
                        <div>Grenade Kills</div>
                        <div>{formattedNumber(focusedEntry.values.grenadeKills, locale)}</div>
                    </Stat>
                </Flex>
                <H4>Weapon Kills</H4>
                <Grid $minCardWidth={175} $gap={1}>
                    {focusedEntry.weapons.map((weapon, hash) => (
                        <WeaponUsed
                            key={hash}
                            hash={hash}
                            kills={weapon.uniqueWeaponKills}
                            definition={weaponDefinitions.get(hash)}
                        />
                    ))}
                </Grid>
            </Card>
        </Flex>
    )
}

const CharacterTab = (props: { character: DestinyPGCRCharacter }) => {
    const { set, get } = useQueryParams<PGCRPageParams>()
    const { data: classHash } = useResolveCharacter(props.character, {
        forceOnLargePGCR: true,
        select: data => data.character.data?.classHash ?? null
    })
    const characterClass = useClassDefinition(classHash ?? 0)
    const className = characterClass?.displayProperties.name ?? "Unknown"
    return (
        <H4
            $mBlock={0.2}
            aria-selected={get("character") === props.character.characterId}
            onClick={() => set("character", props.character.characterId)}
            style={{
                padding: "0.5rem"
            }}>
            {className}
        </H4>
    )
}

const WeaponUsed = (props: {
    hash: number
    kills: number
    definition: DestinyInventoryItemDefinition | undefined
}) => {
    const icon = bungieIconUrl(props.definition?.displayProperties.icon)
    const { locale } = useLocale()
    return (
        <TooltipContainer
            tooltipId={`weapon-${props.definition?.displayProperties.name ?? props.hash}`}
            tooltipBody={
                <TooltipData>{props.definition?.displayProperties.name ?? "Unknown"}</TooltipData>
            }>
            <WeaponItem data-weapon-hash={props.hash}>
                <Link
                    href={`https://d2foundry.gg/w/${props.hash}?referrer=raidhub`}
                    target="_blank"
                    style={{ aspectRatio: "1/1", display: "block", width: "64px", height: "64px" }}>
                    <Image
                        src={icon}
                        unoptimized
                        width={64}
                        height={64}
                        alt={props.definition?.displayProperties.name ?? "Unknown"}
                    />
                </Link>
                <div style={{ flex: 1, textAlign: "center" }}>
                    {formattedNumber(props.kills, locale)}
                </div>
            </WeaponItem>
        </TooltipContainer>
    )
}

const SelectedPlayer = styled(Container)`
    border-radius: 8px;
    overflow: hidden;

    border: 1px solid ${({ theme }) => theme.colors.border.light};
    cursor: pointer;
    display: flex;
`

const Stat = styled(Flex)`
    &:hover {
        transform: scale(1.02);
    }
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 30%);

    font-size: 1.25rem;

    & *:nth-child(1) {
        font-weight: 200;
    }

    & *:nth-child(2) {
        font-size: 1.625rem;
    }
`

Stat.defaultProps = {
    $padding: 0.5,
    $crossAxis: "flex-start",
    $direction: "column",
    $gap: 0.2
}

const WeaponItem = styled(Flex)`
    &:hover {
        transform: scale(1.02);
    }
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 30%);

    font-size: 1.625rem;
`

WeaponItem.defaultProps = {
    $padding: 0.25,
    $fullWidth: true,
    $align: "center"
}
