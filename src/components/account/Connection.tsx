import Image from "next/image"
import styles from "~/styles/pages/account.module.css"
import { Socials } from "~/util/profile/socials"

export default function Connection({
    unlink,
    link,
    serviceName,
    username,
    social
}: {
    username: string | null
    social: Socials
    serviceName: string
    link: () => void
    unlink: () => void
}) {
    const canLink = !username

    return (
        <div className={styles["glossy-bg"]}>
            <div className={styles["connection-head"]}>
                <h3>{serviceName}</h3>
                <i>{username}</i>
                <div className={styles["social-icon-container"]}>
                    <Image src={`/social-icons/${social}.png`} alt={serviceName} fill />
                </div>
            </div>
            <div className={styles["buttons"]}>
                <button onClick={link} disabled={!canLink}>
                    Add {serviceName}
                </button>
                <button onClick={unlink} disabled={canLink}>
                    Unlink {serviceName}
                </button>
            </div>
        </div>
    )
}
