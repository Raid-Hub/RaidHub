import Image from "next/image"
import styles from "../../styles/header.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Account, Question_Mark } from "../../images/icons"
import { useLocale } from "../app/LocaleManager"
import Link from "next/link"
import { Variants, motion } from "framer-motion"

const variants = {
    open: {
        height: "unset",
        gridTemplateRows: "1fr"
    },
    closed: { height: "unset", gridTemplateRows: "0fr" }
} satisfies Variants

const AccountIcon = () => {
    const { data: sessionData, status } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const { strings } = useLocale()

    // todo: replace question mark with loading
    const image = useMemo(
        () => (status === "loading" ? Question_Mark : sessionData?.user?.image ?? Account),
        [sessionData, status]
    )

    const handleIconClick = () => {
        setIsDropdownOpen(old => !old)
    }

    const handleItemClick = () => {
        setIsDropdownOpen(false)
    }

    useEffect(() => {
        if (isDropdownOpen) {
            const handler = (e: MouseEvent) => {
                // detecth if we've clicked into the component or not
                if (ref.current && !ref.current.contains(e.target as Node)) {
                    setIsDropdownOpen(false)
                }
            }
            document.addEventListener("click", handler)
            return () => {
                document.removeEventListener("click", handler)
            }
        }
    }, [isDropdownOpen])

    const animate: keyof typeof variants = isDropdownOpen ? "open" : "closed"
    return (
        <div className={styles["account-dropdown"]}>
            <div
                ref={ref}
                className={styles["account-button"]}
                role="button"
                onClick={handleIconClick}>
                <Image src={image} alt="profile" fill sizes="30px" />
            </div>
            <motion.div
                className={styles["account-dropdown-content-container"]}
                animate={animate}
                variants={variants}>
                <ul className={styles["account-dropdown-content"]} onClick={handleItemClick}>
                    {sessionData ? (
                        <>
                            <li>
                                <Link href="/account">{strings.manageAccount}</Link>
                            </li>
                            {sessionData.user.destinyMembershipType &&
                                sessionData.user.destinyMembershipId && (
                                    <li>
                                        <Link
                                            href={`/profile/${sessionData.user.destinyMembershipType}/${sessionData.user.destinyMembershipId}`}
                                            className={styles["account-link"]}>
                                            {strings.viewProfile}
                                        </Link>
                                    </li>
                                )}
                            <li onClick={() => signOut({ callbackUrl: "/" })}>
                                <span>{strings.logOut}</span>
                            </li>
                        </>
                    ) : (
                        <li
                            onClick={() => {
                                signIn(
                                    "bungie",
                                    {
                                        callbackUrl: encodeURI(window.location.href)
                                    },
                                    "reauth=true"
                                )
                            }}>
                            <span>{strings.logIn}</span>
                        </li>
                    )}
                </ul>
            </motion.div>
        </div>
    )
}

export default AccountIcon
