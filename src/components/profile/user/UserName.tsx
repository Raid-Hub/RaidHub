import styles from "~/styles/pages/profile/user.module.css"
import BungieName from "~/models/BungieName"

type UserNameProps = {
    displayName: string
    bungieGlobalDisplayName?: string | null
    bungieGlobalDisplayNameCode?: number | string | null
}
const UserName = ({
    displayName,
    bungieGlobalDisplayName,
    bungieGlobalDisplayNameCode
}: UserNameProps) => {
    if (bungieGlobalDisplayName && bungieGlobalDisplayNameCode) {
        try {
            const bungieName = new BungieName(bungieGlobalDisplayName, bungieGlobalDisplayNameCode)
            return (
                <span className={styles["username"]}>
                    <span>{bungieName.name}</span>
                    <span className={styles["discrim"]}>{"#" + bungieName.fixedBungieCode}</span>
                </span>
            )
        } catch {}
    }
    return (
        <span className={styles["username"]}>
            <span>{displayName}</span>
        </span>
    )
}

export default UserName
