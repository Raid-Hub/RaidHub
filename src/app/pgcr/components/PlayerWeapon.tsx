import { type DestinyInventoryItemDefinition } from "bungie-net-core/models"
import Link from "next/link"
import styled from "styled-components"
import { $media } from "~/app/layout/media"
import { useLocale } from "~/app/layout/wrappers/LocaleManager"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"
import { WeaponIcon } from "~/components/WeaponIcon"
import { Flex } from "~/components/layout/Flex"
import { formattedNumber } from "~/util/presentation/formatting"

export const PlayerWeapon = (props: {
    hash: number
    kills: number
    definition: DestinyInventoryItemDefinition
}) => {
    const { locale } = useLocale()
    return (
        <TooltipContainer
            tooltipId={`weapon-${props.definition?.displayProperties.name ?? props.hash}`}
            tooltipBody={
                <TooltipData>{props.definition?.displayProperties.name ?? "Unknown"}</TooltipData>
            }>
            <WeaponItem data-weapon-hash={props.hash}>
                <Link href={`https://d2foundry.gg/w/${props.hash}`}>
                    <WeaponIcon
                        size={64}
                        sizeMobile={48}
                        icon={props.definition?.displayProperties.icon}
                        iconWatermark={props.definition.iconWatermark}
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
