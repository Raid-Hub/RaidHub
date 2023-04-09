import { UserInfoCard } from 'oodestiny/schemas';
import styles from '../../styles/profile.module.css';

type UserCardProps = {
    userInfo: UserInfoCard
    emblemBackgroundPath: string
}

const UserCard = ({ userInfo, emblemBackgroundPath }: UserCardProps) => {
    return (<div className={styles["profile"]}>
        <div className={styles["profile-banner"]}>
            <img className={styles["image-background"]} src={`https://bungie.net${emblemBackgroundPath}`} alt="" />
        </div>

        <div className={styles["profile-details"]}>
            <img src={"https://bungie.net" + (userInfo.iconPath ?? "/img/profile/avatars/default_avatar.gif")} alt="" />
            <div className={styles["profile-username"]}>
                <span>{userInfo.bungieGlobalDisplayName ?? userInfo.displayName}</span>
                <span className={styles["discrim"]}>
                    {userInfo.bungieGlobalDisplayNameCode ? "#" + fixCode(userInfo.bungieGlobalDisplayNameCode) : ""}
                </span>
            </div>
        </div>
        <div className={styles["profile-icons"]}>
            <img src="/icons/twitter.png" alt="twitter" className={styles["img-social"]} />
            <img src="/icons/discord.png" alt="discord" className={styles["img-social"]} />
            <img src="/icons/bungo.png" alt="bungie" className={styles["img-social"]} />
            <img src="/icons/twitch.png" alt="twitch" className={styles["img-social"]} />
            <img src="/icons/youtube.png" alt="youtube" className={styles["img-social"]} />
        </div>
    </div>)
}

export default UserCard;

// since the code is a number, leading zeroes get cut off
function fixCode(code: number): string {
    const str = code.toString();
    const missingZeroes = 4 - str.length
    return `${"0".repeat(missingZeroes)}${str}`
}