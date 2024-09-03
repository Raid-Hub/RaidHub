import Image from "next/image"
import styled from "styled-components"
import { Flex } from "~/components/layout/Flex"
import { useItemDefinition } from "~/hooks/dexie"
import { type RaidHubWeaponMetric } from "~/services/raidhub/types"
import { bungieIconUrl } from "~/util/destiny"
import { formattedNumber } from "~/util/presentation/formatting"
import { useLocale } from "../layout/wrappers/LocaleManager"

export const WeaponTableRow = ({ weapon, rank }: { weapon: RaidHubWeaponMetric; rank: number }) => {
    const { locale } = useLocale()
    const definition = useItemDefinition(weapon.hash)
    const displayName = definition?.displayProperties.name ?? "Unknown"
    return (
        <tr>
            <Td>{rank}</Td>
            <Td>
                <WeaponIdentifiers>
                    <Image
                        src={bungieIconUrl(definition?.displayProperties.icon)}
                        width={32}
                        height={32}
                        alt={displayName}
                        unoptimized
                    />
                    <span>{displayName}</span>
                </WeaponIdentifiers>
            </Td>
            <Td>{formattedNumber(weapon.totalKills, locale)}</Td>
            <Td>{formattedNumber(weapon.totalUsage, locale)}</Td>
        </tr>
    )
}

const Td = styled.td`
    font-size: 0.875rem;
    height: 4rem;
`

const WeaponIdentifiers = styled(Flex).attrs({
    $align: "flex-start",
    $padding: 0
})`
    min-width: 20ch;
`
