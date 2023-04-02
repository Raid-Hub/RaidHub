import styles from '../../styles/profile.module.css';

interface SidebarProps {

}

const Sidebar = ({ }: SidebarProps) => {
    return (
        <aside className={styles["sidebar"]}>
            <div className={styles["profile"]}>
                <div className={styles["profile-banner"]}>
                    <img className={styles["image-background"]} src="images/Bruce_Final.png" alt="" />
                </div>

                <div className={styles["profile-image"]}>
                    <img src="/images/bruce.png" alt="" />
                    <p>Bruce<span>#2366</span></p>
                </div>

                <span className={styles["linked-text"]}>Linked Accounts</span>
                <div className={styles["icons"]}>
                    <img src="/icons/twitter.png" alt="" className={styles["img-social"]}/>
                    <img src="/icons/discord.png" alt="" className={styles["img-social"]}/>
                    <img src="/icons/bungie.png" alt="" className={styles["img-social"]}/>
                    <img src="/icons/twitch.png" alt="" className={styles["img-social"]}/>
                    <img src="/icons/youtube.png" alt="" className={styles["img-social"]}/>
                </div>
            </div>

            <div className={styles["profile-banners"]}>
                <img src="/icons/skull.png" alt="" />

                <div className={styles["banners-text"]}>
                    <p>Clears Rank</p>
                    <p className={styles["bold-banner"]}>Challenger #1</p>
                    <p>1hr 01ms 01s</p>
                </div>
            </div>

            <div className={styles["profile-banners"]}>
                <img src="/icons/speed.png" alt="" />

                <div className={styles["banners-text"]}>
                    <p>Speed Rank</p>
                    <p className={styles["bold-banner"]}>Challenger #1</p>
                    <p>1hr 01ms 01s</p>
                </div>
            </div>

            <div className={styles["description"]}>
                <img className={styles["desc-img"]} src="/icons/Codex Banner.png" alt="" />

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

            <div className={styles["token"]}>
                <img src="/logo.png" alt="" />

                <div className={styles["token-text-content"]}>
                    <p className={styles["token-title"]}>RaidHub Founder</p>
                    <p className={styles["token-text"]}>The user contributed to creating RaidHub</p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar;