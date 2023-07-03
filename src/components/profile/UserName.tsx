import styles from "../../styles/profile.module.css"
import BungieName from "../../models/BungieName"

type UserNameProps = {
    displayName: string
    bungieGlobalDisplayName?: string
    bungieGlobalDisplayNameCode?: number
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
                <>
                    <span>{bungieName.name}</span>
                    <span className={styles["discrim"]}>{"#" + bungieName.fixedBungieCode}</span>
                </>
            )
        } catch {}
    }
    return <span>{displayName}</span>
}

export default UserName
