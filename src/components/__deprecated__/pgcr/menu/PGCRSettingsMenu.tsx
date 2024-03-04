"use client"

import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { useSession } from "~/hooks/app/useSession"
import styles from "../pgcr.module.css"
import PinPCRCell from "./PinPGCRCell"

/** @deprecated */
const PGCRSettingsMenu = () => {
    const { data: sessionData } = useSession()
    const { activity } = usePGCRContext()

    return (
        <div className={styles["settings-menu-dropdown"]}>
            {activity?.players.some(
                p => p.membershipId === sessionData?.user.destinyMembershipId
            ) && <PinPCRCell />}
        </div>
    )
}

export default PGCRSettingsMenu
