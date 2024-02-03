"use client"

import Toolbox from "components/toolbox/Toolbox"
import Link from "next/link"
import React from "react"
import styles from "~/styles/footer.module.css"
import iconStyles from "~/styles/svg-icons.module.css"
import manifest from "../../../public/manifest.json"
import { useIsVisible } from "../../hooks/util/useIsVisible"
import DiscordIcon from "../../images/icons/connections/DiscordIcon"
import Email from "../../images/icons/connections/Email"
import TwitterIcon from "../../images/icons/connections/TwitterIcon"
import { SVGProps } from "../reusable/SVG"

const developers: [display: string, path: string][] = [
    ["Newo", "newo"],
    ["Sam", "sam"],
    ["Theos", "theos"]
]

const contactIcons: { url: string; Icon: React.FC<SVGProps> }[] = [
    {
        url: `https://discord.gg/raidhub`,
        Icon: DiscordIcon
    },
    {
        url: "https://www.twitter.com/raidhubapp",
        Icon: TwitterIcon
    },
    {
        url: `mailto:admin@raidhub.io`,
        Icon: Email
    }
]

export default function Footer() {
    const ref = React.useRef<HTMLDivElement>(null)

    const isVisible = useIsVisible(ref, undefined)

    const { version } = manifest
    return (
        <footer id="footer" className={styles["footer"]} ref={ref}>
            <Toolbox isFooterVisible={isVisible} />
            <div className={styles["top"]}>
                <div className={styles["left"]}>
                    <div>Developed by</div>
                    <div className={styles["developers"]}>
                        {developers.map(([display, path], idx) => (
                            <React.Fragment key={idx}>
                                <Link className={styles["developer"]} href={`/${path}`}>
                                    {display}
                                </Link>
                                {idx !== developers.length - 1 && <span>{", "}</span>}
                            </React.Fragment>
                        ))}{" "}
                    </div>
                </div>
                <div className={styles["right"]}>
                    {contactIcons.map(({ url, Icon }, key) => (
                        <Link
                            key={key}
                            className={styles["img-social"]}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Icon sx={30} className={iconStyles["color-on-hover"]} />
                        </Link>
                    ))}
                </div>
            </div>

            <div className={styles["bottom"]}>
                <div className={styles["left"]}>
                    RaidHub <span className={styles["version"]}>alpha-{version}</span>
                </div>
                <div className={[styles["right"], styles["legal"]].join(" ")}>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/terms">Terms</Link>
                </div>
            </div>
        </footer>
    )
}
