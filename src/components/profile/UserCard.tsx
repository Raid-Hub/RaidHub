import { UserInfoCard } from "bungie-net-core/models"
import styles from "../../styles/profile.module.css"
import SocialTag from "./SocialTag"
import { fixBungieCode } from "../../util/presentation/formatting"
import { ProfileSocialData } from "../../types/types"

type UserCardProps = {
    userInfo: UserInfoCard
    emblemBackgroundPath: string
    backgroundImage: string
    socials?: ProfileSocialData[]
}

const UserCard = ({ userInfo, emblemBackgroundPath, backgroundImage, socials }: UserCardProps) => {
    const customStyling = backgroundImage
        ? {
              style: { backgroundImage }
          }
        : {}
    return (
        <div className={styles["profile"]} {...customStyling}>
            <div className={styles["profile-banner"]}>
                <img
                    className={styles["image-background"]}
                    src={`https://bungie.net${emblemBackgroundPath}`}
                    alt=""
                />
            </div>
            <div className={styles["profile-details"]}>
                <img
                    src={
                        "https://bungie.net" +
                        (userInfo.iconPath ?? "/img/profile/avatars/default_avatar.gif")
                    }
                    alt=""
                />
                <div className={styles["profile-username"]}>
                    <span>{userInfo.bungieGlobalDisplayName ?? userInfo.displayName}</span>
                    <span className={styles["discrim"]}>
                        {userInfo.bungieGlobalDisplayNameCode
                            ? "#" + fixBungieCode(userInfo.bungieGlobalDisplayNameCode)
                            : ""}
                    </span>
                </div>
            </div>
            <div className={styles["profile-icons"]}>
                {socials?.map((social, key) => (
                    <SocialTag {...social} key={key} />
                ))}
            </div>
        </div>
    )
}

export default UserCard
