import { UserInfoCard } from "bungie-net-core/lib/models"
import styles from "../../styles/profile.module.css"
import SocialTag from "./SocialTag"
import { ProfileSocialData } from "../../types/profile"
import UserName from "./UserName"
import Loading from "../global/Loading"

type UserCardProps = {
    isLoading: boolean
    userInfo: UserInfoCard | undefined
    emblemBackgroundPath?: string
    backgroundImage: string
    socials: ProfileSocialData[] | undefined
}

const UserCard = ({
    isLoading,
    userInfo,
    emblemBackgroundPath,
    backgroundImage,
    socials
}: UserCardProps) => {
    const customStyling = backgroundImage
        ? {
              style: { backgroundImage }
          }
        : {}
    return isLoading || !userInfo ? (
        <Loading wrapperClass={styles["profile-card"]} />
    ) : (
        <div className={styles["profile-card"]} {...customStyling}>
            <div className={styles["profile-banner"]}>
                <img
                    className={styles["image-background"]}
                    src={emblemBackgroundPath && `https://bungie.net${emblemBackgroundPath}`}
                    alt=""
                />
            </div>
            <div className={styles["profile-details"]}>
                <img
                    src={
                        "https://bungie.net" +
                        (userInfo?.iconPath ?? "/img/profile/avatars/default_avatar.gif")
                    }
                    alt=""
                />
                {
                    <div className={styles["profile-username"]}>
                        <UserName {...userInfo} />
                    </div>
                }
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
