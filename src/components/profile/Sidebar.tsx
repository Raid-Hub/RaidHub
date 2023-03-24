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
                    <img src="images/bruce.png" alt="" />
                    <p>Bruce<span>#2366</span></p>
                </div>

                <p className={styles["linked-text"]}>Linked Accounts</p>
                <img src="images/icons.png" alt="" className={styles["img-social"]}/>
            </div>

            <div className={styles["profile-banners"]}>
                <img src="images/Skull.png" alt="" />

                <div className={styles["banners-text"]}>
                    <p>Clears Rank</p>
                    <p className={styles["bold-banner"]}>Challenger #1</p>
                    <p>1hr 01ms 01s</p>
                </div>
            </div>

            <div className={styles["profile-banners"]}>
                <img src="images/speed.png" alt="" />

                <div className={styles["banners-text"]}>
                    <p>Speed Rank</p>
                    <p className={styles["bold-banner"]}>Challenger #1</p>
                    <p>1hr 01ms 01s</p>
                </div>
            </div>

            <div className={styles["description"]}>
                <img className={styles["desc-img"]} src="images/Codex Banner.png" alt="" />

                <div className={styles["description-right"]}>
                    <p className={styles["desc-title"]}>SNOW [わ]</p>
                    <p className={styles["desc-subtitle"]}>"七転び八起き"</p>
                    <p className={styles["desc-text"]}>Requirements: Clarify's approval</p>

                    <div className={styles["description-list"]}>
                        <img src="images/Diamond.png" alt="" />
                        <p>Trio Flawless <span>x150</span></p>
                    </div>

                    <div className={styles["description-list"]}>
                        <img src="images/Diamond.png" alt="" />
                        <p>Trio Flawless <span>x150</span></p>
                    </div>

                    <div className={styles["description-list"]}>
                        <img src="images/Diamond.png" alt="" />
                        <p>Trio Flawless Master<span>x150</span></p>
                    </div>
                </div>
            </div>

            <div className={styles["token"]}>
                <img src="images/logo.png" alt="" />

                <div className={styles["token-text-content"]}>
                    <p className={styles["token-title"]}>RaidHub Founder</p>
                    <p className={styles["token-text"]}>The user contributed to creating RaidHub</p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar;