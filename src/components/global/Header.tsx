import Link from "next/link"
import styles from "../../styles/header.module.css"
import SearchBar from "./SearchBar"
import Image from "next/image"
import Logo from "../../../public/logo.png"
import { Account } from "../../images/icons"

type HeaderProps = {}

const Header = ({}: HeaderProps) => {
    return (
        <header className={styles["header"]}>
            <nav id={styles.nav}>
                <Link href={"/"} className={styles["logo"]}>
                    <Image className={styles["logo-img"]} src={Logo} alt="logo" />
                    <span className={styles["logo-text"]}>RaidHub</span>
                </Link>
                <div className={styles["right-content"]}>
                    <SearchBar />
                    <Link href="/account">
                        <Image className={styles["profile-img"]} src={Account} alt="profile" />
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default Header
