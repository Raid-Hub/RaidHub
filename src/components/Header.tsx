import styles from "../styles/header.module.css"

type HeaderProps = {}

const Header = ({}: HeaderProps) => {
    return (
        <header>
            <nav id={styles.nav}>
                <div id={styles.logo}>
                    <img id={styles["logo-img"]} src="/logo.png" alt="logo" />
                    <span id={styles["logo-text"]}>RaidHub</span>
                </div>
                <div id={styles["right-content"]}>
                    <img id={styles["search-img"]} src="/icons/search.png" alt="search" />
                    <input
                        id={styles["search-bar"]}
                        type="text"
                        placeholder="Search for a Guardian"
                    />
                    <img id={styles["profile-img"]} src="/icons/profile-icon.png" alt="profile" />
                </div>
            </nav>
        </header>
    )
}

export default Header
