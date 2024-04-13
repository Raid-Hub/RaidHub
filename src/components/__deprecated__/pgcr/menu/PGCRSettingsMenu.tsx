"use client"

import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { useSession } from "~/hooks/app/useSession"
import styles from "../pgcr.module.css"
import PinPCRCell from "./PinPGCRCell"

/** @deprecated */
const PGCRSettingsMenu = () => {
    const { data: sessionData } = useSession()
    const { data } = usePGCRContext()

    return (
        <div className={styles["settings-menu-dropdown"]}>
            {data?.players.some(
                p => p.player.membershipId === sessionData?.user.destinyMembershipId
            ) && <PinPCRCell />}
        </div>
    )
}

export default PGCRSettingsMenu
