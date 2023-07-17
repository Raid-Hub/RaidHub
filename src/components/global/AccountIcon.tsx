import Image from "next/image"
import styles from "../../styles/header.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { useMemo } from "react"
import { Account } from "../../images/icons"
import { useLocale } from "../app/LanguageProvider"

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
                                <a href="/account">{strings.manageAccount}</a>
                            </li>
                            {sessionData.user.destinyMembershipType &&
                                sessionData.user.destinyMembershipId && (
                                    <li>
                                        <a
                                            href={`/profile/${sessionData.user.destinyMembershipType}/${sessionData.user.destinyMembershipId}`}
                                            className={styles["account-link"]}>
                                            {strings.viewProfile}
                                        </a>
                                    </li>
                                )}
                            <li onClick={() => signOut({ callbackUrl: "/" })}>{strings.logOut}</li>
                        </>
                    ) : (
                        <li onClick={() => signIn()}>{strings.logIn}</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default AccountIcon
