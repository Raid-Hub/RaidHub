import React from "react"
import styles from "../styles/footer.module.css"
import SocialTag from "./profile/SocialTag"
import { Socials } from "../util/socials"


type FooterProps = {}

const developers = ["Theos", "Newo", "Bruce"]

const Footer = ({}: FooterProps) => {
    return <footer className={styles["footer"]}>
        <span className={styles["version"]}> v2023.1.3</span>
        <div className={styles["contact"]}>
            <span className={styles["contact-text"]}>Contact us</span>
            <SocialTag id={Socials.Twitter} displayName={"@raidhub"} url={"https://www.twitter.com/raidhub"}/>
        </div>
        <span className={styles["developers"]}>Developed by {developers.join(", ")}</span>
    </footer>
}

export default Footer
