import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"
import { useLocale } from "~/app/layout/managers/LocaleManager"
import { $media } from "~/app/layout/media"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"
import { Flex } from "~/components/layout/Flex"
import { useItemDefinition } from "~/hooks/dexie"
import { bungieIconUrl } from "~/util/destiny"
import { formattedNumber } from "~/util/presentation/formatting"

export const PlayerWeapon = (props: { hash: number; kills: number }) => {
    const definition = useItemDefinition(props.hash)
    const icon = bungieIconUrl(definition?.displayProperties.icon)
    const { locale } = useLocale()
    return (
        <TooltipContainer
            tooltipId={`weapon-${definition?.displayProperties.name ?? props.hash}`}
            tooltipBody={
                <TooltipData>{definition?.displayProperties.name ?? "Unknown"}</TooltipData>
            }>
            <WeaponItem data-weapon-hash={props.hash}>
                <WeaponIcon
                    href={`https://d2foundry.gg/w/${props.hash}?referrer=raidhub`}
                    target="_blank">
                    <Image
                        src={icon}
                        unoptimized
                        fill
                        alt={definition?.displayProperties.name ?? "Unknown"}
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
