import Link from "next/link"
import styles from "../../styles/header.module.css"
import SearchBar from "./SearchBar"
import Image from "next/image"
import Logo from "../../../public/logo.png"
import { Account } from "../../images/icons"
import { useSession } from "next-auth/react"
import { useMemo } from "react"

type HeaderProps = {}

const Header = ({}: HeaderProps) => {
    const session = useSession()

    const accountSrc = useMemo(() => {
        if (session.status === "authenticated") {
            return session.data.user?.image ?? ""
        } else {
            return Account
        }
    }, [session])
    return (
        <header className={styles["header"]}>
            <Link href={"/"} className={styles["logo"]}>
                <Image className={styles["logo-img"]} src={Logo} alt="logo" sizes="40px" />
                <span className={styles["logo-text"]}>RaidHub</span>
            </Link>
            <div className={styles["right-content"]}>
                <SearchBar />
                <Link href="/account" className={styles["account-link"]}>
                    <Image
                        className={styles["account-img"]}
                        src={accountSrc}
                        alt="profile"
                        fill
                        sizes="30px"
                    />
                </Link>
            </div>
        </header>
    )
}

export default Header
