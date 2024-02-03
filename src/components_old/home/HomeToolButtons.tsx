import Link from "next/link"
import Search from "~/components/icons/Search"
import styles from "../../styles/pages/home.module.css"

const HomeToolButtons = () => {
    return (
        <div className={styles["tool-buttons-container"]}>
            <Link href={"/guardians"} className={styles["tool-button"]}>
                <Search color="white" />
                Guardian Inspector
            </Link>
            <Link href={"/find"} className={styles["tool-button"]}>
                <Search color="white" />
                Activity <br />
                Finder
            </Link>
        </div>
    )
}

export default HomeToolButtons
