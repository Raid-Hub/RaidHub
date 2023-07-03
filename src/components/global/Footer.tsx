import React from "react"
import styles from "../../styles/footer.module.css"
import { Socials } from "../../util/profile/socials"
import Link from "next/link"
import manifest from "../../../public/manifest.json"

type FooterProps = {}

const developers = ["Newo", "Bruce", "Theos"]
const raidHubMailAddress = "raidhub@support.com"
const contactIcons: { url: string; id: Socials }[] = [
    {
        url: `https://discord.gg/`,
        id: Socials.Discord
    },
    {
        url: "https://www.twitter.com/raidhub",
        id: Socials.Twitter
    },
    {
        url: `mailto:${raidHubMailAddress}`,
        id: Socials.Mail
    }
]

const Footer = ({}: FooterProps) => {
    const { version } = manifest
    return (
        <footer id={styles["footer"]}>
            <div className={styles["footer-left"]}>
                <p>Copyright © 2023 RaidHub. All rights reserved.</p>
                <p>RaidHub v{version}</p>
            </div>
            <div className={styles["footer-mid"]}>
                <div className={styles["contact-text"]}>Contact us</div>
                {contactIcons.map(({ url, id }, key) => (
                    <Link
                        key={key}
                        className={styles["img-social"]}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer">
                        <svg>
                            <defs>
                                <mask id={id}>
                                    <image
                                        x="0"
                                        y="0"
                                        width="100%"
                                        height="100%"
                                        xlinkHref={`/icons/${id}.png`}
                                    />
                                </mask>
                            </defs>
                            <rect
                                className={styles[`${id}-logo`]}
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                mask={`url(#${id})`}
                            />
                        </svg>
                    </Link>
                ))}
            </div>
            <div className={styles["footer-right"]}>
                <div>
                    <div>Developed by</div>
                    <div className={styles["developers"]}>{developers.join(", ")} </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
