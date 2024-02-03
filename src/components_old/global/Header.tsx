"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import Logo from "../../../public/logo.png"
import styles from "../../styles/header.module.css"
import AccountDropdown from "./AccountDropdown"
import AccountIcon from "./AccountIcon"
import SearchBar from "./SearchBar"

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
