"use client"

import type { DestinyItemSocketState } from "bungie-net-core/models"
import Image from "next/image"
import { useItemDefinition } from "~/hooks/dexie"
import { bungieItemUrl } from "~/util/destiny/bungie-icons"
import styles from "./guardians.module.css"

export type EnabledDestinyItemSocketState = DestinyItemSocketState & {
    isEnabled: true
    plugHash: number
}

export default function Socket({ socket }: { socket: EnabledDestinyItemSocketState }) {
    const socketData = useItemDefinition(socket.plugHash)

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
