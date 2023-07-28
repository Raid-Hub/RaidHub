import Image from "next/image"
import styles from "../../styles/header.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { useMemo } from "react"
import { Account } from "../../images/icons"
import { useLocale } from "../app/LanguageProvider"
import Link from "next/link"

type AccountIconProps = {}

const AccountIcon = ({}: AccountIconProps) => {
    const { data: sessionData } = useSession()
    const { strings } = useLocale()

    const image = useMemo(() => sessionData?.user?.image ?? Account, [sessionData])

    return (
        <div className={styles["account-dropdown"]}>
            <div className={styles["account-button"]}>
                <Image src={image} alt="profile" fill sizes="30px" />
            </div>
            <div className={styles["account-dropdown-content-container"]}>
                <ul className={styles["account-dropdown-content"]}>
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
                                        callbackUrl: window.location.href
                                    },
                                    "reauth=false"
                                )
                            }}>
                            <span>{strings.logIn}</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default AccountIcon
