import styles from "../../../styles/pages/profile/mid.module.css"
import Loading from "../../global/Loading"
import { toCustomDateString } from "../../../util/presentation/formatting"
import { useLocale } from "../../app/LocaleManager"
import RaidBanners from "../../../images/raid-banners"
import Link from "next/link"
import { useBungieClient } from "~/components/app/TokenManager"
import EagerEdge from "~/images/icons/destiny2/EagerEgde"
import PinIcon from "~/images/icons/PinIcon"
import CloudflareImage from "~/images/CloudflareImage"
import { useRaidHubActivity } from "~/hooks/raidhub/useRaidHubActivity"

type PinnedActivityProps = {
    activityId: string
    isPinned: boolean
    isLoadingActivities: boolean
    isLoadingRaidHubProfile: boolean
}

const PinnedActivity = ({
    activityId,
    isPinned,
    isLoadingActivities,
    isLoadingRaidHubProfile
}: PinnedActivityProps) => {
    const bungie = useBungieClient()
    const { data: pgcr, isLoading: isLoadingPGCR } = bungie.pgcr.useQuery(
        { activityId },
        { staleTime: Infinity }
    )
    const { locale, strings } = useLocale()
    const { data: activity } = useRaidHubActivity(activityId)

    return isLoadingPGCR || isLoadingActivities || isLoadingRaidHubProfile ? (
        <Loading className={styles["pinned-activity-loading"]} />
    ) : pgcr ? (
        <Link href={`/pgcr/${activityId}`} className={styles["pinned-activity"]}>
            {pgcr.raid !== null && (
                <CloudflareImage
                    className={styles["pinned-background"]}
                    cloudflareId={RaidBanners[pgcr.raid]}
                    alt="Pinned activity"
                    fill
                    priority
                />
            )}
            {isPinned && <PinIcon sx={20} color="white" className={styles["pin-icon"]} />}
            <div className={styles["pinned-activity-text"]}>
                {activity && (
                    <p className={styles["pinned-activity-title"]}>
                        {pgcr.title(strings, activity)}
                    </p>
                )}
            </div>
            <div className={styles["pinned-activity-subtext"]}>
                <p>{toCustomDateString(pgcr.completionDate, locale)}</p>

                <div className={styles["pinned-activity-time"]}>
                    <EagerEdge sx={20} color="white" />
                    <span>{pgcr.speed.string(strings)}</span>
                </div>
            </div>
        </Link>
    ) : null
}

export default PinnedActivity
