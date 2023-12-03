import Link from "next/link"
import styles from "../../styles/header.module.css"
import { useEffect, useState } from "react"
import SearchBar from "./SearchBar"
import Image from "next/image"
import Logo from "../../../public/logo.png"
import AccountIcon from "./AccountIcon"
import AccountDropdown from "./AccountDropdown"

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY
            setIsScrolled(scrolled > 0)
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <>
            <header
                id="header"
                className={`${styles["header"]} ${isScrolled ? "" : styles["no-border"]}`}>
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
                    <AccountIcon
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                    />
                </div>
            </header>
            <AccountDropdown isDropdownOpen={isDropdownOpen} />
        </>
    )
}

export default Header
