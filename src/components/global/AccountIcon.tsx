import Image from "next/image"
import styles from "../../styles/header.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { useMemo } from "react"
import { Account, Question_Mark } from "../../images/icons"
import { useLocale } from "../app/LocaleManager"
import Link from "next/link"

type AccountIconProps = {}

const AccountIcon = ({}: AccountIconProps) => {
    const { data: sessionData, status } = useSession()
    const { strings } = useLocale()

    // todo: replace question mark with loading
    const image = useMemo(
        () => (status === "loading" ? Question_Mark : sessionData?.user?.image ?? Account),
        [sessionData, status]
    )

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
                                        callbackUrl: encodeURI(window.location.href)
                                    },
                                    "reauth=true"
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
