import { SVGComponent } from "~/components/SVG"
import DiscordIcon from "~/components/icons/DiscordIcon"
import Email from "~/components/icons/Email"
import TwitterIcon from "~/components/icons/TwitterIcon"

const developers: [display: string, path: string][] = [
    ["Newo", "newo"],
    ["Sam", "sam"],
    ["Theos", "theos"]
]

const contactIcons: { url: string; Icon: SVGComponent }[] = [
    {
        url: `https://discord.gg/raidhub`,
        Icon: DiscordIcon
    },
    {
        url: "https://www.twitter.com/raidhubio",
        Icon: TwitterIcon
    },
    {
        url: `mailto:admin@raidhub.io`,
        Icon: Email
    }
]

export default function Footer() {
    return (
        <footer id="footer" className={styles["footer"]} ref={ref}>
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
