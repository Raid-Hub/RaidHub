import Link from "next/link"
import styles from "../../styles/header.module.css"
import { useEffect } from "react"
import SearchBar from "./SearchBar"
import Image from "next/image"
import Logo from "../../../public/logo.png"
import AccountIcon from "./AccountIcon"

const Header = () => {
    useEffect(() => {
        const handleScroll: EventListener = () => {
            const header = document.querySelector(`.${styles.header}`)
            const scrolled = window.scrollY

            if (header) {
                if (scrolled === 0) {
                    header.classList.add(`${styles["no-border"]}`)
                } else {
                    header.classList.remove(`${styles["no-border"]}`)
                }
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <header id="header" className={`${styles["header"]} ${styles["no-border"]}`}>
            <Link href={"/"} className={styles["logo"]}>
                <Image
                    className={styles["logo-img"]}
                    src={Logo}
                    alt="logo"
                    width={30}
                    height={30}
                />
                <span className={styles["logo-text"]}>RaidHub</span>
            </Link>
            <div className={styles["right-content"]}>
                <SearchBar />
                <AccountIcon />
            </div>
        </header>
    )
}

export default Header
