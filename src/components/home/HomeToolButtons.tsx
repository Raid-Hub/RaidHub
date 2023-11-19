import styles from "../../styles/pages/home.module.css"
import Link from "next/link";
import Search from "~/images/icons/Search";

const HomeToolButtons = () => {
    return (
        <div className={styles["tool-buttons-container"]}>
            <div className={styles["tool-button"]}>
                <Search color="white"/>
                <Link href={"/guardians"}>
                    Guardian Inspector
                </Link>
            </div>
            <div className={styles["tool-button"]}>
                <Search color="white"/>
                <Link href={"/activity"}>
                    Activity <br/>Finder
                </Link>
            </div>
        </div>
    )
}

export default HomeToolButtons