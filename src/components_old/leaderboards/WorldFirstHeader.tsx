import RaidBanners from "~/data/raid-banners"
import CloudflareImage from "~/images/CloudflareImage"
import styles from "~/styles/pages/leaderboards.module.css"
import { ListedRaid } from "~/types/raidhub-api"
import { useRaidHubManifest } from "../../app/(layout)/managers/RaidHubManifestManager"

export default function WorldFirstHeader({
    title,
    subtitle,
    raid
}: {
    title: string
    subtitle?: string
    raid: ListedRaid
}) {
    const { getRaidString } = useRaidHubManifest()
    return (
        <div className={styles["world-first-header"]}>
            <h1 className={styles["header-h1"]}>{title}</h1>
            {subtitle && <h3 className={styles["header-h3"]}>{subtitle}</h3>}
            <CloudflareImage
                priority
                cloudflareId={RaidBanners[raid]}
                alt={getRaidString(raid)}
                fill
                className={styles["world-first-header-image"]}
            />
        </div>
    )
}
