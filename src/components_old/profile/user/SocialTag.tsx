import styles from "~/styles/pages/profile/user.module.css"
import { ProfileSocialData } from "~/types/profile"

type SocialTagProps = ProfileSocialData

const SocialTag = ({ id, displayName: username, url, Icon }: SocialTagProps) => {
    const inner = (
        <>
            <div className={styles["img-social"]}>
                <Icon sx={30} color="white" />
            </div>
            <div className={styles["social-divider"]} />
            <div className={styles["social-text"]}>
                <span>{username}</span>
            </div>
        </>
    )
    return url ? (
        <a className={styles["social"]} href={url} target="_blank" rel="noopener noreferrer">
            {inner}
        </a>
    ) : (
        <span id={styles[id]} className={styles["social"]}>
            {inner}
        </span>
    )
}

export default SocialTag
