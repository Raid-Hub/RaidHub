import styles from "../../../styles/pages/profile/raids.module.css"
import Loading from "../../global/Loading"
import ActivityTile from "./ActivityTile"
import { useState } from "react"
import { Raid } from "../../../types/raids"
import RaidReportDataCollection from "../../../models/profile/data/RaidReportDataCollection"
import { useLocale } from "../../app/LocaleManager"
import { ExtendedActivity } from "../../../types/profile"

const CARDS_PER_PAGE = 60

type RecentRaidsProps = {
    isLoading: boolean
    allActivitiesFiltered: ExtendedActivity[] | null | null
    raidReport: Map<Raid, RaidReportDataCollection> | null
}

const RecentRaids = ({ isLoading, allActivitiesFiltered, raidReport }: RecentRaidsProps) => {
    const [pages, setPages] = useState<number>(1)
    const { strings } = useLocale()

    return (
        <div className={styles["recent"]}>
            {isLoading
                ? Array(CARDS_PER_PAGE)
                      .fill(null)
                      .map((_, key) => <Loading key={key} wrapperClass={styles["placeholder"]} />)
                : allActivitiesFiltered && (
                      <>
                          {allActivitiesFiltered
                              .slice(0, pages * CARDS_PER_PAGE)
                              .map(({ activity, extended }, key) => (
                                  <ActivityTile
                                      key={key}
                                      activity={activity}
                                      playerCount={extended.playerCount}
                                      flawless={extended.flawless}
                                  />
                              ))}
                          {allActivitiesFiltered.length > pages * CARDS_PER_PAGE && (
                              <button
                                  className={styles["load-more"]}
                                  onClick={() => setPages(pages + 1)}>
                                  <span>{strings.loadMore}</span>
                              </button>
                          )}
                      </>
                  )}
        </div>
    )
}

export default RecentRaids
