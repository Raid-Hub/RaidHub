import { UserInfoCard } from "oodestiny/schemas"
import styles from "../../styles/profile.module.css"
import SocialTag from "./SocialTag"
import { Socials } from "../../util/socials"
import { fixBungieCode } from "../../util/math"

type UserCardProps = {
    userInfo: UserInfoCard
    emblemBackgroundPath: string
    backgroundImage: string
}

const UserCard = ({ userInfo, emblemBackgroundPath, backgroundImage }: UserCardProps) => {
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
                <SocialTag
                    id={Socials.Bungie}
                    username={"Newo#9010"}
                    url={"https://www.bungie.net/7/en/User/Profile/3/4611686018488107374"}
                />
                <SocialTag
                    id={Socials.Twitter}
                    username={"@kneewoah"}
                    url={"https://twitter.com/kneewoah"}
                />
                <SocialTag
                    id={Socials.Discord}
                    username={"Newo#0001"}
                    url={"https://discord.gg/aXuN3qwDRK"}
                />
                <SocialTag
                    id={Socials.YouTube}
                    username={"Newo"}
                    url={"https://youtube.com/@Newo1"}
                />
                <SocialTag id={Socials.Twitch} username={"newoX"} url={"https://twitch.tv/newox"} />
            </div>
        </div>
    )
}

export default UserCard
