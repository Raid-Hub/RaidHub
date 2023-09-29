import RaidBanners from "~/images/raid-banners"
import styles from "~/styles/pages/leaderboards.module.css"
import { ListedRaid } from "~/types/raids"
import { useLocale } from "../app/LocaleManager"
import CloudflareImage from "~/images/CloudflareImage"

export default function WorldFirstHeader({
    title,
    subtitle,
    raid
}: {
    title: string
    subtitle?: string
    raid: ListedRaid
}) {
    const { strings } = useLocale()
    return (
        <section className={styles["world-first-header"]}>
            <h1>{title}</h1>
            {subtitle && <h3>{subtitle}</h3>}
            <CloudflareImage
                priority
                cloudflareId={RaidBanners[raid]}
                alt={strings.raidNames[raid]}
                fill
                className={styles["world-first-header-image"]}
            />
        </section>
    )
}
