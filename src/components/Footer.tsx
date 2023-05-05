import React from "react"
import styles from "../styles/footer.module.css"
import SocialTag from "./profile/SocialTag"
import { Socials } from "../util/socials"
import Image from "next/image"
import Twitter from "../../public/icons/twitter.png"
import Link from "next/link"
import { EnvelopeIcon } from "@heroicons/react/24/solid"


type FooterProps = {}

const developers = [ "Newo", "Bruce", "Theos"]
const raidHubMailAddress = "raidhub@support.com"
const contactIcons = [
    {
        url: "https://www.twitter.com/raidhub",
        id: Socials.Twitter
    }
]

const Footer = ({}: FooterProps) => {
    return <footer className={styles["footer"]}>
        <span className={styles["footer-text"]}> v2023.1.3</span>
        <div className={styles["contact"]}>
            <Link href={`mailto:${raidHubMailAddress}`}>
                <EnvelopeIcon className={styles["mail-icon"]}/>
            </Link>
            <span className={styles["contact-text"]}>Contact us</span>
            {contactIcons.map((contactIcon) => (
                <Link
                    href={contactIcon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg className={styles["img-social"]}>
                        <defs>
                            <mask id={contactIcon.id}>
                                <image
                                    x="0"
                                    y="0"
                                    width="100%"
                                    height="100%"
                                    xlinkHref={`/icons/${contactIcon.id}.png`}
                                />
                            </mask>
                        </defs>
                        <rect
                            className={styles[`${contactIcon.id}-logo`]}
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            mask={`url(#${contactIcon.id})`}
                        />
                    </svg>
                </Link>
        ))}
        </div>
        <span className={styles["footer-text"]}>Developed by <div className={styles["developers"]}>{developers.join(", ")} </div></span>
    </footer>
}

export default Footer