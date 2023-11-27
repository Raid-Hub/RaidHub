import Image from "next/image"
import styles from "../../styles/header.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { useLocale } from "../app/LocaleManager"
import Link from "next/link"
import { Variants, m } from "framer-motion"
import QuestionMark from "~/images/icons/QuestionMark"
import UserIcon from "~/images/icons/UserIcon"

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
                {status === "authenticated" ? (
                    <Image src={sessionData.user.image} alt="profile" fill unoptimized />
                ) : status === "loading" ? (
                    <QuestionMark color="white" />
                ) : (
                    <UserIcon color="white" />
                )}
            </div>
            {isDropdownOpen &&
                <m.div
                    className={styles["account-dropdown-content-container"]}
                    initial={"closed"}
                    animate={animate}
                    variants={variants}>
                    <ul className={styles["account-dropdown-content"]} onClick={handleItemClick}>
                        {sessionData ? (
                            <>
                                <div className={styles["account-dropdown-top"]}>
                                    <Image src={sessionData.user.image} alt="profile" width={65} height={65}  unoptimized />
                                    <div className={styles["account-dropdown-top-user"]}>
                                        <a className={styles["account-dropdown-name"]}>{sessionData.user.name}</a>
                                        <a className={styles["account-dropdown-id"]}>{sessionData.user.destinyMembershipId}</a>
                                    </div>
                                </div>
                                <hr />
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
                </m.div>
            }
        </div>
    )
}

export default AccountIcon
