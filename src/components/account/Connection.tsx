import { ClientSafeProvider, SignInAuthorizationParams, signIn } from "next-auth/react"
import styles from "~/styles/pages/account.module.css"

export default function Connection({
    provider,
    unlink,
    authorizationParams,
    username
}: {
    provider: ClientSafeProvider
    authorizationParams?: SignInAuthorizationParams
    username: string | null
    unlink: () => void
}) {
    const name = provider.name
    const canLink = !username

    return (
        <div className={styles["connection"]}>
            <div className={styles["connection-head"]}>
                <h3>{name}</h3>
                <i>{username}</i>
            </div>
            <div className={styles["buttons"]}>
                <button
                    onClick={() => signIn(provider.id, {}, authorizationParams)}
                    disabled={!canLink}>
                    Add {name} account
                </button>
                <button onClick={unlink} disabled={canLink}>
                    Unlink {name}
                </button>
            </div>
        </div>
    )
}
