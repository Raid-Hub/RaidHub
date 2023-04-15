import Link from "next/link"
import styles from "../styles/header.module.css"
import SearchBar from "./SearchBar"

type HeaderProps = {}

const Header = ({}: HeaderProps) => {
    return (
        <header>
            <nav id={styles.nav}>
                <Link href={"/"} className={styles["logo"]}>
                    <img className={styles["logo-img"]} src="/logo.png" alt="logo" />
                    <span className={styles["logo-text"]}>RaidHub</span>
                </Link>
                <div className={styles["right-content"]}>
                    <img className={styles["search-img"]} src="/icons/search.png" alt="search" />
                    <SearchBar />
                    <img
                        className={styles["profile-img"]}
                        src="/icons/profile-icon.png"
                        alt="profile"
                    />
                </div>
            </nav>
        </header>
    )
}

export default Header
