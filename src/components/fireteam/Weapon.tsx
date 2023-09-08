import styles from "~/styles/pages/fireteam.module.css"
import Image from "next/image"
import { DestinyItemComponent } from "bungie-net-core/models"
import { Question_Mark } from "~/images/icons"
import { useItem } from "../app/DestinyManifestManager"

export default function Weapon({ item }: { item: DestinyItemComponent }) {
    const { data } = useItem(item.itemHash)
    return (
        <div className={styles["weapon"]}>
            <Image
                className={styles["weapon-icon"]}
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
            <div className={styles["weapon-details"]}>
                <h4>{data?.displayProperties.name}</h4>
                <span>{data?.itemTypeDisplayName}</span>
            </div>
        </div>
    )
}
