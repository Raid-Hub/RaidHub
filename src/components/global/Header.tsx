import Link from "next/link"
import styles from "../../styles/header.module.css"
import { useEffect, useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Variants, m } from "framer-motion"
import { useLocale } from "../app/LocaleManager"
import RightArrow from "~/images/icons/RightArrow"
import SearchBar from "./SearchBar"
import Image from "next/image"
import Logo from "../../../public/logo.png"
import AccountIcon from "./AccountIcon"

const variants = {
    open: {
        height: "unset",
        gridTemplateRows: "1fr"
    },
    closed: { height: "unset", gridTemplateRows: "0fr" }
} satisfies Variants

const Header = () => {
    const { data: sessionData } = useSession()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const { strings } = useLocale()

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

    const animate: keyof typeof variants = isDropdownOpen ? "open" : "closed"

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
            {isDropdownOpen && (
                <m.div
                    className={styles["account-dropdown-content-container"]}
                    initial={"closed"}
                    animate={animate}
                    variants={variants}>
                    <div className={styles["account-dropdown-content"]}>
                        {sessionData ? (
                            <>
                                <div className={styles["account-dropdown-top"]}>
                                    <div className={styles["account-dropdown-top-user"]}>
                                        <a className={styles["account-dropdown-name"]}>
                                            {sessionData.user.name}
                                        </a>
                                        <a className={styles["account-dropdown-id"]}>
                                            {sessionData.user.destinyMembershipId}
                                        </a>
                                    </div>
                                </div>
                                <hr style={{ borderColor: "var(--border)" }} />
                                {sessionData.user.destinyMembershipType &&
                                    sessionData.user.destinyMembershipId && (
                                        <div className={`${styles["card-section"]}`}>
                                            <Link
                                                href={`/profile/${sessionData.user.destinyMembershipType}/${sessionData.user.destinyMembershipId}`}
                                                className={styles["content-section"]}>
                                                <div>
                                                    <h4>{strings.viewProfile}</h4>
                                                </div>
                                                <div className={styles["content-section-arrow"]}>
                                                    <RightArrow />
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                <div className={`${styles["card-section"]}`}>
                                    <Link href="/account" className={styles["content-section"]}>
                                        <div>
                                            <h4>{strings.manageAccount}</h4>
                                        </div>
                                        <div className={styles["content-section-arrow"]}>
                                            <RightArrow />
                                        </div>
                                    </Link>
                                </div>
                                <div
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className={styles["content-section"]}>
                                    <div>
                                        <span>{strings.logOut}</span>
                                    </div>
                                    <div className={styles["content-section-arrow"]}>
                                        <RightArrow />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div
                                onClick={() => {
                                    signIn("bungie", {
                                        callbackUrl: encodeURI(window.location.href)
                                    })
                                }}
                                className={styles["content-section"]}>
                                <div>
                                    <span>{strings.logIn}</span>
                                </div>
                                <div className={styles["content-section-arrow"]}>
                                    <RightArrow />
                                </div>
                            </div>
                        )}
                    </div>
                </m.div>
            )}
        </>
    )
}

export default Header
