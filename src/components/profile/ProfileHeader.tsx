import styles from '../../styles/profile.module.css';

interface ProfileHeaderProps {
}

const ProfileHeader = ({ }: ProfileHeaderProps) => {
    return (
        <div className={styles["card-header"]}
            style={{ backgroundImage: "url('https://www.bungie.net/img/destiny_content/pgcr/raid_beanstalk.jpg')" }}>
            <img className={styles["pin"]} src="/icons/pin.png" alt="" />

            <div className={styles["card-header-text"]}>
                <p className={styles["card-header-title"]}>last wish</p>

                <div className={styles["card-badge"]}>
                    <img src="/icons/diamond.png" alt="" />
                    <p>Trio Flawless</p>
                </div>
            </div>
            <div className={styles["card-header-subtext"]}>
                <p>Achieved on February 23rd, 2022</p>

                <div className={styles["card-header-time"]}>
                    <img src="/icons/speed.png" alt="" width={"20px"} height={"20px"}/>
                    <p>34m 15s</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader;