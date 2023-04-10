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
            <svg className={styles["img-social"]}>
                <defs>
                    <mask id="twitter">
                        <image x="0" y="0" width="100%" height="100%" xlinkHref={"/icons/twitter.png"} />
                    </mask>
                </defs>
                <rect className={styles["twitter-logo"]}
                    x="0" y="0" width="100%" height="100%" mask="url(#twitter)" />
            </svg>
            <svg className={styles["img-social"]}>
                <defs>
                    <mask id="discord">
                        <image x="0" y="0" width="100%" height="100%" xlinkHref={"/icons/discord.png"} />
                    </mask>
                </defs>
                <rect className={styles["discord-logo"]}
                    x="0" y="0" width="100%" height="100%" mask="url(#discord)" />
            </svg>
            <svg className={styles["img-social"]}>
                <defs>
                    <mask id="youtube">
                        <image x="0" y="0" width="100%" height="100%" xlinkHref={"/icons/youtube.png"} />
                    </mask>
                </defs>
                <rect className={styles["youtube-logo"]}
                    x="0" y="0" width="100%" height="100%" mask="url(#youtube)" />
            </svg>
            <svg className={styles["img-social"]}>
                <defs>
                    <mask id="twitch">
                        <image x="0" y="0" width="100%" height="100%" xlinkHref={"/icons/twitch.png"} />
                    </mask>
                </defs>
                <rect className={styles["twitch-logo"]}
                    x="0" y="0" width="100%" height="100%" mask="url(#twitch)" />
            </svg>
            <svg className={styles["img-social"]}>
                <defs>
                    <mask id="bungie">
                        <image x="0" y="0" width="100%" height="100%" xlinkHref={"/icons/bungie.png"} />
                    </mask>
                </defs>
                <rect className={styles["bungie-logo"]}
                    x="0" y="0" width="100%" height="100%" mask="url(#bungie)" />
            </svg>
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