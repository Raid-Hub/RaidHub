import Image from "next/image"
import styles from "~/styles/pages/home.module.css"
import Logo from "../../../public/logo.png"

const HomeLogo = () => {
    return (
        <div className={styles["home-logo"]}>
            <Image className={styles["logo-img"]} src={Logo} alt="logo" width={70} height={70} />
            <span className={styles["logo-text"]}>Raid<span className={styles["logo-glow"]}>Hub</span></span>
        </div>
    )
}
export default HomeLogo
