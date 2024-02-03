import { Variants, m } from "framer-motion"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import RightArrow from "~/images/icons/RightArrow"
import styles from "../../styles/header.module.css"

const variants = {
    open: {
        height: "unset",
        gridTemplateRows: "1fr"
    },
    closed: { height: "unset", gridTemplateRows: "0fr" }
} satisfies Variants

type AccountDropdownProps = {
    isDropdownOpen: boolean
}

const AccountDropdown = ({ isDropdownOpen }: AccountDropdownProps) => {
    const { data: sessionData } = useSession()

    const animate: keyof typeof variants = isDropdownOpen ? "open" : "closed"
    return (
        <>
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
                                                    <h4>View Profile</h4>
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
                                            <h4>Manage Account</h4>
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
                                        <span>Logout</span>
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
                                    <span>Log In</span>
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

export default AccountDropdown
