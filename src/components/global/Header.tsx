import Link from "next/link"
import styles from "../../styles/header.module.css"
import SearchBar from "./SearchBar"
import Image from "next/image"
import Logo from "../../../public/logo.png"
import AccountIcon from "./AccountIcon"
import SearchDiv from "./SearchDiv"

type HeaderProps = {}

const Header = ({}: HeaderProps) => {
    return (
        <div className="">
            <header className={styles["header"]}>
                <Link href={"/"} className={styles["logo"]}>
                    <Image className={styles["logo-img"]} src={Logo} alt="logo" sizes="40px" />
                    <span className={styles["logo-text"]}>RaidHub</span>
                </Link>
                <div className={styles["right-content"]}>
                    <SearchBar />
                    <AccountIcon />
                </div>
            </header>

            <SearchDiv />
        </div>
    )
}

export default Header
