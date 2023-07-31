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
            <div className={styles["top"]}>
                <div className={styles["left"]}>
                    <div>Developed by</div>
                    <div className={styles["developers"]}>
                        {developers.map((dev, idx) => (
                            <React.Fragment key={idx}>
                                <Link
                                    className={styles["developer"]}
                                    href={`/${dev.toLowerCase()}`}>
                                    {dev}
                                </Link>
                                {idx !== developers.length - 1 && <span>{", "}</span>}
                            </React.Fragment>
                        ))}{" "}
                    </div>
                </div>
                <div className={styles["right"]}>
                    {contactIcons.map(({ url, id }, key) => (
                        <Link
                            key={key}
                            className={styles["img-social"]}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer">
                            <svg width="100%" height="100%">
                                <defs>
                                    <mask id={id}>
                                        <image
                                            x="0"
                                            y="0"
                                            width="100%"
                                            height="100%"
                                            xlinkHref={`/social-icons/${id}.png`}
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
            </div>

            <div className={styles["bottom"]}>
                <div className={styles["left"]}>
                    <p>
                        RaidHub <span className={styles["version"]}>alpha-{version}</span>
                    </p>
                </div>
                <div className={styles["right"]}>
                    <p>
                        <span>Data from </span>
                        <a className={styles["url"]} href="https://raid.report">
                            Raid Report
                        </a>{" "}
                        and{" "}
                        <a className={styles["url"]} href="https://bungie.net/7">
                            Bungie
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
