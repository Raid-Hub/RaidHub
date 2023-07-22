import styles from "../../../styles/pages/profile/user.module.css"
import { UserInfoCard } from "bungie-net-core/lib/models"
import SocialTag from "./SocialTag"
import { ProfileSocialData } from "../../../types/profile"
import UserName from "./UserName"
import Loading from "../../global/Loading"
import Image from "next/image"

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
                {emblemBackgroundPath && (
                    <Image
                        className={styles["image-background"]}
                        src={`https://bungie.net${emblemBackgroundPath}`}
                        width={474}
                        height={96}
                        priority
                        alt="profile banner"
                    />
                )}
                <div className={styles["details"]}>
                    <Image
                        src={
                            "https://bungie.net" +
                            (userInfo?.iconPath ?? "/img/profile/avatars/default_avatar.gif")
                        }
                        width={474}
                        height={96}
                        alt="profile picture"
                    />

                    <div className={styles["username"]}>
                        <UserName {...userInfo} />
                    </div>
                </div>
            </div>

            <div className={styles["icons"]}>
                {socials && socials.map((social, key) => <SocialTag {...social} key={key} />)}
            </div>
        </div>
    )
}

export default UserCard
