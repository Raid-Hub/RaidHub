import styles from "~/styles/pages/inpsect.module.css"
import Image from "next/image"
import { DestinyItemSocketState } from "bungie-net-core/models"
import { useItem } from "../app/DestinyManifestManager"
import { bungieItemUrl } from "~/util/destiny/bungie-icons"

export type EnabledDestinyItemSocketState = DestinyItemSocketState & {
    isEnabled: true
    plugHash: number
}

export default function Socket({ socket }: { socket: EnabledDestinyItemSocketState }) {
    const { data: socketData } = useItem(socket.plugHash)

    return socketData?.displayProperties.icon ? (
        <div className={styles["socket"]} data-socket-hash={socket.plugHash}>
            <Image
                className={styles["weapon-icon"]}
                src={bungieItemUrl(socketData.displayProperties.icon)}
                unoptimized
                alt={socketData.displayProperties.name}
                width={20}
                height={20}
            />
            <div>{socketData?.displayProperties.name}</div>
        </div>
    ) : null
}
