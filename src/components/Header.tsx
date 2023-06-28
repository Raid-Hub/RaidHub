import Link from "next/link"
import styles from "../styles/header.module.css"
import SearchBar from "./SearchBar"
import { useSession } from "next-auth/react"
import { Icons } from "../util/icons"

type HeaderProps = {}

const Header = ({}: HeaderProps) => {
    return (
        <header className={styles["header"]}>
            <nav id={styles.nav}>
                <Link href={"/"} className={styles["logo"]}>
                    <img className={styles["logo-img"]} src="/logo.png" alt="logo" />
                    <span className={styles["logo-text"]}>RaidHub</span>
                </Link>
                <div className={styles["right-content"]}>
                    <SearchBar />
                    <Link href="/account">
                        <img className={styles["profile-img"]} src={Icons.PROFILE} alt="profile" />
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default Header
