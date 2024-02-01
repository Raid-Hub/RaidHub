import Image from "next/image"
import Link from "next/link"
import { HTMLAttributeAnchorTarget, ReactNode } from "react"
import { SpeedData } from "~/data/speedrun-com-mappings"
import DiscordIcon from "~/images/icons/connections/DiscordIcon"
import SpeedrunIcon from "~/images/icons/connections/SpeedrunIcon"
import styles from "~/styles/pages/leaderboards.module.css"
import { ListedRaid } from "~/types/raidhub-api"

type CategoryData = {
    raidId: string
    category?: {
        variable: string
        value: string
    }
}

const baseURL = () => new URL("https://www.speedrun.com/destiny2")

function gameRules() {
    const url = baseURL()
    url.searchParams.set("rules", "game")
    return url
}

function x(url: URL, { raidId, category }: CategoryData) {
    url.searchParams.set(
        "x",
        `${raidId}${category ? `-${category.variable}.${category.value}` : ""}`
    )
}

function raidRules(categoryData: CategoryData) {
    const url = baseURL()
    url.searchParams.set("rules", "category")
    x(url, categoryData)
    return url
}

function submitRunURL(categoryData: CategoryData) {
    const url = baseURL()
    url.pathname += "/runs/new"
    url.searchParams.set("rules", "game")
    x(url, categoryData)
    return url
}

export default function SpeedrunComBanner({
    title,
    subtitle,
    raidId,
    category
}: {
    title: string
    subtitle?: string
    raid: ListedRaid
    others?: Record<string, SpeedData>
} & CategoryData) {
    return (
        <div className={styles["rta-info"]}>
            <div className={styles["src-splash-container"]}>
                <div className={styles["titles"]}>
                    <h1 className={styles["rta"]}>RTA Speedrun Leaderboards</h1>
                    <h1 className={styles["primary-title"]}>{title}</h1>
                    <h1 className={styles["primary-title"]}>{subtitle}</h1>
                </div>
                <Image
                    priority
                    src={
                        "https://cdn.discordapp.com/attachments/1136751502912934060/1154485702755631165/SRC_SERVER_BANNER.png?size=1024"
                    }
                    alt="Destiny 2 on Speedrun.com"
                    fill
                    unoptimized
                />
            </div>
            <nav className={styles["rta-info-links"]}>
                <InfoLink href={gameRules()} displayText={"Game Rules"}>
                    <SpeedrunIcon sx={25} />
                </InfoLink>
                <InfoLink href={raidRules({ raidId, category })} displayText={"Raid Rules"}>
                    <SpeedrunIcon sx={25} />
                </InfoLink>
                <InfoLink href="https://discord.gg/d2speedrun" displayText={"SRC Discord"}>
                    <DiscordIcon sx={25} color="white" />
                </InfoLink>
                <InfoLink href={submitRunURL({ raidId, category })} displayText={"Submit Run"}>
                    <SpeedrunIcon sx={25} />
                </InfoLink>
            </nav>
            {/* {others && (
                <div className={styles["other-rta-boards"]}>
                    <h4>Other Boards</h4>
                    <div className={styles["rta-info-links"]}>
                        {Object.entries(others)
                            .filter(([_, { id }]) => id !== category?.value)
                            .map(([key, { id, name }]) => (
                                <InfoLink
                                    key={id}
                                    href={`/leaderboards/${RaidToUrlPaths[raid]}/src/${key}`}
                                    displayText={strings.leaderboards[name]}
                                    target="_self"
                                />
                            ))}
                    </div>
                </div>
            )} */}
        </div>
    )
}

function InfoLink({
    href,
    displayText,
    children,
    target = "_blank"
}: {
    href: string | URL
    displayText: string
    children?: ReactNode
    target?: HTMLAttributeAnchorTarget
}) {
    return (
        <Link href={href} target={target} className={styles["rta-info-link"]}>
            <span>{displayText}</span>
            {children && <div className={styles["rta-info-link-child"]}>{children}</div>}
        </Link>
    )
}
