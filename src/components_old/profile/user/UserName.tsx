import styles from "./user.module.css"

type UserNameProps = {
    membershipId: string
    displayName: string | null
    bungieGlobalDisplayName?: string | null
    bungieGlobalDisplayNameCode?: number | string | null
}
const UserName = ({
    membershipId,
    displayName,
    bungieGlobalDisplayName,
    bungieGlobalDisplayNameCode
}: UserNameProps) => {
    if (bungieGlobalDisplayName && bungieGlobalDisplayNameCode) {
        return (
            <span className={styles["username"]}>
                <span>{bungieGlobalDisplayName}</span>
                <span className={styles["discrim"]}>{"#" + bungieGlobalDisplayNameCode}</span>
            </span>
        )
    }
    return (
        <span className={styles["username"]}>
            <span>{displayName || membershipId}</span>
        </span>
    )
}

export default UserName
