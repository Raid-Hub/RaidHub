import styles from "~/styles/pages/leaderboards.module.css"
import Link from "next/link"
import Image from "next/image"
import { HTMLAttributeAnchorTarget, ReactNode } from "react"
import { SpeedData } from "~/data/speedrun-com-mappings"
import { useLocale } from "../app/LocaleManager"
import { RaidToUrlPaths } from "~/util/destiny/raidUtils"
import { ListedRaid } from "~/types/raids"

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
    raid,
    raidId,
    category,
    others
}: {
    title: string
    subtitle?: string
    raid: ListedRaid
    others?: Record<string, SpeedData>
} & CategoryData) {
    const { strings } = useLocale()
    return (
        <div className={styles["rta-info"]}>
            <div className={styles["src-splash-container"]}>
                <div className={styles["titles"]}>
                    <h1>{title}</h1>
                    <h2>{subtitle}</h2>
                </div>
                <Image
                    priority
                    src={
                        "https://cdn.discordapp.com/banners/584802382819491841/7b817a3bf93d2d9d3293390c70c03fdf.webp?size=1024"
                    }
                    alt="Destiny 2 on Speedrun.com"
                    fill
                    unoptimized
                />
            </div>
            <nav className={styles["rta-info-nav"]}>
                <div className={styles["rta-info-links"]}>
                    <InfoLink href={raidRules({ raidId, category })} displayText={"Raid Rules"} />
                    <InfoLink
                        href={submitRunURL({ raidId, category })}
                        displayText={"Submit Run"}
                    />
                    <InfoLink href="https://discord.gg/d2speedrun" displayText={"SRC Discord"}>
                        <Image src={"/social-icons/discord.png"} alt="discord" fill />
                    </InfoLink>
                    <InfoLink href={gameRules()} displayText={"Game Rules"} />
                </div>
                {others && (
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
                )}
            </nav>
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
