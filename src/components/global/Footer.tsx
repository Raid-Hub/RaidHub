import React from "react"
import styles from "~/styles/footer.module.css"
import iconStyles from "~/styles/svg-icons.module.css"
import Link from "next/link"
import manifest from "../../../public/manifest.json"
import DiscordIcon from "~/images/icons/connections/DiscordIcon"
import TwitterIcon from "~/images/icons/connections/TwitterIcon"
import Email from "~/images/icons/connections/Email"
import { SVGProps } from "~/components/reusable/SVG"
import { useIsVisible } from "~/hooks/util/useIsVisible"

const developers = ["Newo", "Bruce", "Theos"]
const raidHubMailAddress = "admin@raidhub.app"
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
        url: `mailto:${raidHubMailAddress}`,
        Icon: Email
    }
]

export default function Footer({ setIsVisible }: { setIsVisible: (isVisible: boolean) => void }) {
    const ref = React.useRef<HTMLDivElement>(null)
    const isFooterVisible = useIsVisible(ref, undefined, setIsVisible)

    const { version } = manifest
    return (
        <footer id="footer" className={styles["footer"]} ref={ref}>
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
