import { Collection } from "@discordjs/collection"
import { useMemo, useState } from "react"
import { RaidHubPlayerActivitiesActivity } from "~/types/raidhub-api"
import { useLocale } from "../../../app/(layout)/managers/LocaleManager"
import Loading from "../../../components/Loading"
import styles from "../../../styles/pages/profile/raids.module.css"
import { useFilterContext } from "../Profile"
import ActivityTile from "./ActivityTile"

const CARDS_PER_PAGE = 60

type RecentRaidsProps =
    | {
          isLoading: false
          allActivities: Collection<string, RaidHubPlayerActivitiesActivity>
      }
    | { isLoading: true; allActivities: null }

const RecentRaids = ({ isLoading, allActivities }: RecentRaidsProps) => {
    const [pages, setPages] = useState<number>(1)
    const filter = useFilterContext()

    const activities = useMemo(
        () =>
            Array.from(allActivities?.values() ?? [])
                .filter(filter)
                .sort((a, b) => b.dateStarted.getTime() - a.dateStarted.getTime()),
        [allActivities, filter]
    )

    const { strings } = useLocale()

    return (
        <>
            <div className={styles["recent"]}>
                {isLoading
                    ? Array(CARDS_PER_PAGE)
                          .fill(null)
                          .map((_, key) => <Loading key={key} className={styles["placeholder"]} />)
                    : activities
                          .slice(0, pages * CARDS_PER_PAGE)
                          .map((activity, key) => <ActivityTile key={key} activity={activity} />)}
            </div>
            {activities.length > pages * CARDS_PER_PAGE && (
                <button className={styles["load-more"]} onClick={() => setPages(pages + 1)}>
                    <span>{strings.loadMore}</span>
                </button>
            )}
        </>
    )
}

export default RecentRaids
