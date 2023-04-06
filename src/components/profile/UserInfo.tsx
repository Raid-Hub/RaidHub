import { DestinyProfileComponent } from 'oodestiny/schemas';
import styles from '../../styles/profile.module.css';
import { useClan } from '../../hooks/clan';
import { RGBA } from '../../util/types';

type UserInfoProps = {
    profile: DestinyProfileComponent
}

const UserInfo = ({ profile }: UserInfoProps) => {
    const { clan, isLoading: isClanLoading } = useClan(profile.userInfo)
    console.log(clan)
    return (
        <section className={styles["user-info"]}>
            <div className={styles["profile"]}>
                <div className={styles["profile-banner"]}>
                    <img className={styles["image-background"]} src="images/Bruce_Final.png" alt="" />
                </div>

                <div className={styles["profile-image"]}>
                    <img src={"https://bungie.net" + (profile.userInfo.iconPath ?? "/img/profile/avatars/default_avatar.gif")} alt="" />
                    <p>
                        <span>{profile.userInfo.bungieGlobalDisplayName ?? profile.userInfo.displayName}</span>
                        <span className={styles["discrim"]}>
                            {profile.userInfo.bungieGlobalDisplayNameCode ? "#" + profile.userInfo.bungieGlobalDisplayNameCode : ""}
                        </span>
                    </p>
                </div>

                <p className={styles["linked-text"]}>Linked Accounts</p>
                <div className={styles["profile-icons"]}>
                    <img src="/icons/twitter.png" alt="" className={styles["img-social"]} />
                    <img src="/icons/discord.png" alt="" className={styles["img-social"]} />
                    <img src="/icons/bungie.png" alt="" className={styles["img-social"]} />
                    <img src="/icons/twitch.png" alt="" className={styles["img-social"]} />
                    <img src="/icons/youtube.png" alt="" className={styles["img-social"]} />
                </div>
            </div>

            <div className={styles["ranking-banners"]}>
                <div className={styles["ranking-banner"]}>
                    <img src="/icons/skull.png" alt="" />

                    <div className={styles["banners-text"]}>
                        <p>Clears Rank</p>
                        <p className={styles["bold-banner"]}>Challenger #1</p>
                        <p>1hr 01ms 01s</p>
                    </div>
                </div>

                <div className={styles["ranking-banner"]}>
                    <img src="/icons/speed.png" alt="" />

                    <div className={styles["banners-text"]}>
                        <p>Speed Rank</p>
                        <p className={styles["bold-banner"]}>Challenger #1</p>
                        <p>1hr 01ms 01s</p>
                    </div>
                </div>

                <div className={styles["ranking-banner"]}>
                    <img src="/logo.png" alt="" style={{ marginRight: "0.5em" }} />

                    <div className={styles["token-text-content"]}>
                        <p className={styles["token-title"]}>RaidHub Founder</p>
                        <p className={styles["token-text"]}>The user contributed to creating RaidHub</p>
                    </div>
                </div>
            </div>

            <div className={styles["clan"]}>
                <svg className={styles["clan-img"]}>
                    <rect x="0" y="0" width="100%" height="100%" fill={RGBAToHex(clan?.clanBanner.primary)} />
                </svg>

                <div className={styles["description-right"]}>
                    <span className={styles["desc-title"]}>CLAN [X]</span>
                    <span className={styles["desc-subtitle"]}>"Clan Moto"</span>
                    <span className={styles["desc-text"]}>Clan bio</span>

                    <div className={styles["description-list"]}>
                        <img src="/icons/diamond.png" alt="" />
                        <p>Trio Flawless <span>x150</span></p>
                    </div>

                    <div className={styles["description-list"]}>
                        <img src="/icons/diamond.png" alt="" />
                        <p>Trio Flawless <span>x150</span></p>
                    </div>

                    <div className={styles["description-list"]}>
                        <img src="/icons/diamond.png" alt="" />
                        <p>Trio Flawless Master<span>x150</span></p>
                    </div>
                </div>
            </div>
        </section>
    )
}

function RGBAToHex(rgba: RGBA | undefined): string {
    if (!rgba) return "#EE0000"
    let { red, green, blue, alpha } = rgba
    let r = red.toString(16);
    let g = green.toString(16);
    let b = blue.toString(16);
    let a = alpha.toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}

export default UserInfo;