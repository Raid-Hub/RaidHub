import styles from "../../../styles/pages/profile/raids.module.css"
import Loading from "../../global/Loading"
import ActivityTile from "./ActivityTile"
import { useMemo, useState } from "react"
import { useLocale } from "../../app/LocaleManager"
import { ExtendedActivity } from "../../../types/profile"
import { Collection } from "@discordjs/collection"

const CARDS_PER_PAGE = 60

type RecentRaidsProps = {
    isLoading: boolean
    allActivitiesFiltered: Collection<string, ExtendedActivity>
}

const RecentRaids = ({ isLoading, allActivitiesFiltered }: RecentRaidsProps) => {
    const [pages, setPages] = useState<number>(1)
    const { strings } = useLocale()

    const activities = useMemo(
        () => Array.from(allActivitiesFiltered.values()),
        [allActivitiesFiltered]
    )

    return (
        <>
            <div className={styles["recent"]}>
                {isLoading
                    ? Array(CARDS_PER_PAGE)
                          .fill(null)
                          .map((_, key) => <Loading key={key} className={styles["placeholder"]} />)
                    : activities
                          .slice(0, pages * CARDS_PER_PAGE)
                          .map(({ activity, extended }, key) => (
                              <ActivityTile
                                  key={key}
                                  activity={activity}
                                  playerCount={extended.playerCount}
                                  flawless={extended.flawless}
                              />
                          ))}
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
