import { DestinyHistoricalStatsPeriodGroup } from "oodestiny/schemas";
import styles from '../../styles/profile.module.css';
import { raidDetailsFromHash } from "../../util/raid";
import { RaidCardBackground } from "../../util/raid";
import { useLanguage } from "../../hooks/language";
import { LocalizedStrings } from "../../util/localized-strings";

type ActivityCardProps = {
  activity: DestinyHistoricalStatsPeriodGroup
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const info = raidDetailsFromHash(activity.activityDetails.referenceId.toString())
  const language = useLanguage()
  const strings = LocalizedStrings[language]
  return (
    <div className={styles["activity"]}>
      <div className={styles["activity-content"]}>
        <img src={RaidCardBackground[info.raid]} className={styles["activity-content-img"]} />
        <p className={styles["activity-title"]}>{strings.raidNames[info.raid]}</p>
      </div>

      <div className={styles["success-layer"]}>
        <p style={{color: activity.values.completed.basic.value ? "#98e07b" : "#FF0000"}}>
          {activity.values.completed.basic.value
            ? strings.success
            : strings.incompleteRaid}
        </p>
      </div>
    </div>
  )
}

export default ActivityCard;