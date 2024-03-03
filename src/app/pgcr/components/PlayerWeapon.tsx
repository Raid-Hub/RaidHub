import type { DestinyInventoryItemDefinition } from "bungie-net-core/models"
import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"
import { Flex } from "~/components/layout/Flex"
import { useLocale } from "~/layout/managers/LocaleManager"
import { $media } from "~/layout/media"
import { bungieIconUrl } from "~/util/destiny"
import { formattedNumber } from "~/util/presentation/formatting"

export const PlayerWeapon = (props: {
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
                <WeaponIcon
                    href={`https://d2foundry.gg/w/${props.hash}?referrer=raidhub`}
                    target="_blank">
                    <Image
                        src={icon}
                        unoptimized
                        fill
                        alt={props.definition?.displayProperties.name ?? "Unknown"}
                    />
                </WeaponIcon>
                <div style={{ flex: 1, textAlign: "center" }}>
                    {formattedNumber(props.kills, locale)}
                </div>
            </WeaponItem>
        </TooltipContainer>
    )
}

const WeaponItem = styled(Flex)`
    &:hover {
        transform: scale(1.02);
    }
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 30%);

    font-size: 1.625rem;
    ${$media.max.mobile`
        font-size: 1.25rem;
    `}
`

WeaponItem.defaultProps = {
    $padding: 0.25,
    $fullWidth: true,
    $align: "center"
}

const WeaponIcon = styled(Link)`
    display: block;
    width: 64px;
    ${$media.max.mobile`
        width: 48px;
    `}

    aspect-ratio: 1/1;
    position: relative;
    overflow: hidden;
`
