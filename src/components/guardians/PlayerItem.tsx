import styles from "~/styles/pages/inpsect.module.css"
import Image from "next/image"
import Link from "next/link"
import {
    DestinyInventoryItemDefinition,
    DestinyItemComponent,
    DestinyItemSocketState
} from "bungie-net-core/models"
import { useItem } from "../app/DestinyManifestManager"
import Socket, { EnabledDestinyItemSocketState } from "./Socket"
import Loading from "../global/Loading"
import { bungieItemUrl } from "~/util/destiny/bungie-icons"
import { useExpandedContext } from "~/pages/guardians"

const isExoticArmor = (data: DestinyInventoryItemDefinition) =>
    data?.itemType == 2 && data.inventory?.tierType == 6

export default function PlayerItem({
    item,
    sockets
}: {
    item: DestinyItemComponent
    sockets: DestinyItemSocketState[]
}) {
    const { data, isLoading } = useItem(item.itemHash)

    const isExpanded = useExpandedContext()

    if (isLoading) return <Loading className={styles["item"]} />

    return data &&
        (isExpanded || data.itemType == 16 || data.itemType == 3 || isExoticArmor(data)) ? (
        <div className={styles["item"]} data-item-hash={item.itemHash}>
            <div className={styles["item-main"]}>
                <Image
                    className={styles["item-icon"]}
                    src={bungieItemUrl(data.displayProperties.icon)}
                    unoptimized
                    alt={data.displayProperties.name}
                    width={48}
                    height={48}
                />
                <div className={styles["item-details"]}>
                    <Link href={`https://www.light.gg/db/items/${data.hash}/`} target="_blank">
                        <h4 className={styles["item-details-name"]}>
                            {data.displayProperties.name}
                        </h4>
                    </Link>
                    <span>{data.itemTypeDisplayName}</span>
                </div>
            </div>
            {isExpanded && (
                <div className={styles["sockets"]}>
                    {sockets
                        .filter(
                            (s): s is EnabledDestinyItemSocketState => s.isEnabled && !!s.plugHash
                        )
                        .map((s, idx) => (
                            <Socket key={idx} socket={s} />
                        ))}
                </div>
            )}
        </div>
    ) : null
}
