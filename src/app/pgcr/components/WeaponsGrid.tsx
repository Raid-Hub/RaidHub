import { Collection } from "@discordjs/collection"
import { type DestinyInventoryItemDefinition } from "bungie-net-core/models"
import { useLiveQuery } from "dexie-react-hooks"
import { useMemo } from "react"
import { useDefinitionsCache } from "~/app/layout/wrappers/DestinyManifestManager"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { useDexie } from "~/util/dexie/dexie"
import { PlayerWeapon } from "./PlayerWeapon"

export const WeaponsGrid = ({
    weapons
}: {
    weapons: Collection<number, { kills: number; precisionKills: number }>
}) => {
    const dexieDB = useDexie()
    const cache = useDefinitionsCache("items")

    const hashes = useMemo(() => Array.from(weapons.keys()), [weapons])

    const liveQuery = useLiveQuery(
        () => dexieDB.items.bulkGet(hashes).catch(() => undefined),
        [hashes]
    )

    const weaponDefs = useMemo(() => {
        if (liveQuery) {
            liveQuery.forEach(item => {
                if (item) {
                    cache.set(item.hash, item)
                }
            })
        }

        return weapons
            .mapValues((data, hash) => cache.get(hash))
            .filter((w): w is DestinyInventoryItemDefinition => Boolean(w))
    }, [liveQuery, cache, weapons])

    const partitionedWeapons = useMemo(() => {
        const [kinetic, energy, power, unknown] = Array.from(
            { length: 4 },
            () =>
                new Collection<
                    number,
                    {
                        definition: DestinyInventoryItemDefinition
                        kills: number
                        precisionKills: number
                    }
                >()
        )
        weaponDefs.forEach((def, hash) => {
            if (!def?.equippingBlock) return

            const data = {
                definition: def,
                kills: weapons.get(hash)?.kills ?? 0,
                precisionKills: weapons.get(hash)?.precisionKills ?? 0
            }

            switch (def.equippingBlock.equipmentSlotTypeHash) {
                case 1498876634:
                    kinetic.set(hash, data)
                    break
                case 2465295065:
                    energy.set(hash, data)
                    break
                case 953998645:
                    power.set(hash, data)
                    break
                default:
                    unknown.set(hash, data)
                    break
            }
        })
        return [kinetic, energy, power, unknown]
    }, [weaponDefs, weapons])

    return (
        <Flex $padding={0} $align="flex-start" $direction="column" $fullWidth $gap={4}>
            {partitionedWeapons.map((weapons, index) => (
                <Grid key={index} $minCardWidth={135} $gap={1} $fullWidth>
                    {weapons.map((weapon, hash) => (
                        <PlayerWeapon
                            key={hash}
                            hash={hash}
                            kills={weapon.kills}
                            definition={weapon.definition}
                        />
                    ))}
                </Grid>
            ))}
        </Flex>
    )
}
