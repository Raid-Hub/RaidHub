import Link from "next/link"
import styles from "../../styles/profile.module.css"
import { ProfileSocialData } from "../../types/profile"

type SocialTagProps = ProfileSocialData

const SocialTag = ({ id, displayName: username, url }: SocialTagProps) => {
    return (
        <Link
            id={styles[id]}
            className={styles["social"]}
            href={url}
            target="_blank"
            rel="noopener noreferrer">
            <svg className={styles["img-social"]}>
                <defs>
                    <mask id={id}>
                        <image
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            xlinkHref={`/icons/${id}.png`}
                        />
                    </mask>
                </defs>
                <rect
                    className={styles[`${id}-logo`]}
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    mask={`url(#${id})`}
                />
            </svg>
            <div className={styles["social-divider"]} />
            <div className={styles["social-text"]}>
                <span>{username}</span>
            </div>
        </Link>
    )
}

export default SocialTag
