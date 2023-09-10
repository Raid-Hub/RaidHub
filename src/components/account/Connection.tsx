import { ClientSafeProvider, SignInAuthorizationParams, signIn } from "next-auth/react"
import Image from "next/image"
import styles from "~/styles/pages/account.module.css"
import { Socials } from "~/util/profile/socials"

export default function Connection({
    provider,
    unlink,
    authorizationParams,
    username,
    social
}: {
    provider: ClientSafeProvider
    authorizationParams?: SignInAuthorizationParams
    username: string | null
    social: Socials
    unlink: () => void
}) {
    const name = provider.name
    const canLink = !username

    return (
        <div className={styles["glossy-bg"]}>
            <div className={styles["connection-head"]}>
                <h3>{name}</h3>
                <i>{username}</i>
                <div className={styles["social-icon-container"]}>
                    <Image src={`/social-icons/${social}.png`} alt={provider.name} fill />
                </div>
            </div>
            <div className={styles["buttons"]}>
                <button
                    onClick={() => signIn(provider.id, {}, authorizationParams)}
                    disabled={!canLink}>
                    Add {name}
                </button>
                <button onClick={unlink} disabled={canLink}>
                    Unlink {name}
                </button>
            </div>
        </div>
    )
}
