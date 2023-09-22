import { SVGComponent } from "~/components/reusable/SVG"
import BungieShield from "~/images/icons/connections/BungieShield"
import DiscordIcon from "~/images/icons/connections/DiscordIcon"
import Email from "~/images/icons/connections/Email"
import SpeedrunIcon from "~/images/icons/connections/SpeedrunIcon"
import styles from "~/styles/pages/profile/user.module.css"
import iconStyles from "~/styles/svg-icons.module.css"
import { ProfileSocialData } from "~/types/profile"
import { Socials } from "~/util/profile/socials"

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
