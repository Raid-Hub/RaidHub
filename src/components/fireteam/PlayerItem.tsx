import styles from "~/styles/pages/fireteam.module.css"
import Image from "next/image"
import { DestinyItemComponent, DestinyItemSocketState } from "bungie-net-core/models"
import { Question_Mark } from "~/images/icons"
import { useItem } from "../app/DestinyManifestManager"
import Socket, { EnabledDestinyItemSocketState } from "./Socket"

export default function PlayerItem({
    item,
    sockets
}: {
    item: DestinyItemComponent
    sockets: DestinyItemSocketState[]
}) {
    const { data } = useItem(item.itemHash)
    return (
        <div className={styles["item"]} data-item-hash={item.itemHash}>
            <div className={styles["item-main"]}>
                <Image
                    className={styles["item-icon"]}
                    src={
                        data?.displayProperties.icon
                            ? `https://www.bungie.net${data.displayProperties.icon}`
                            : Question_Mark
                    }
                    unoptimized
                    alt={data?.displayProperties.name ?? ""}
                    width={48}
                    height={48}
                />
                <div className={styles["item-details"]}>
                    <h4 className={styles["item-details-name"]}>{data?.displayProperties.name}</h4>
                    <span>{data?.itemTypeDisplayName}</span>
                </div>
            </div>
            <div className={styles["sockets"]}>
                {sockets
                    .filter((s): s is EnabledDestinyItemSocketState => s.isEnabled && !!s.plugHash)
                    .map((s, idx) => (
                        <Socket key={idx} socket={s} />
                    ))}
            </div>
        </div>
    )
}
