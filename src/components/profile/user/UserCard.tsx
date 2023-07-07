import styles from "../../../styles/pages/profile/user.module.css"
import { UserInfoCard } from "bungie-net-core/lib/models"
import SocialTag from "./SocialTag"
import { ProfileSocialData } from "../../../types/profile"
import UserName from "./UserName"
import Loading from "../../global/Loading"

type UserCardProps = {
    isLoading: boolean
    userInfo: UserInfoCard | undefined
    emblemBackgroundPath?: string
    background: string | null
    socials: ProfileSocialData[] | null
}

const UserCard = ({
    isLoading,
    userInfo,
    emblemBackgroundPath,
    background,
    socials
}: UserCardProps) => {
    const customStyling = background
        ? {
              style: { backgroundImage: background.replace(/;$/, "") ?? "" }
          }
        : {}
    return isLoading || !userInfo ? (
        <Loading wrapperClass={styles["card-loading"]} />
    ) : (
        <div className={styles["card"]} {...customStyling}>
            <div className={styles["banner"]}>
                <img
                    className={styles["image-background"]}
                    src={emblemBackgroundPath && `https://bungie.net${emblemBackgroundPath}`}
                    alt=""
                />
                <div className={styles["details"]}>
                    <img
                        src={
                            "https://bungie.net" +
                            (userInfo?.iconPath ?? "/img/profile/avatars/default_avatar.gif")
                        }
                        alt=""
                    />

                    <div className={styles["username"]}>
                        <UserName {...userInfo} />
                    </div>
                </div>
            </div>

            <div className={styles["icons"]}>
                {socials?.map((social, key) => (
                    <SocialTag {...social} key={key} />
                ))}
            </div>
        </div>
    )
}

export default UserCard
