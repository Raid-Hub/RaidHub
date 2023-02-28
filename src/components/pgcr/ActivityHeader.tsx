import { FC } from 'react';
import { Activity } from '../../models/pgcr/Activity'
import { PGCRComponent } from '../../pages/pgcr/[activityId]'
import styles from '../../styles/pgcr.module.css';

const checkpointDisclaimer = "Note: this report may or may not be a checkpoint due to API issues from Season of the Hunt through Season of the Risen"
const incomplete = "Incomplete"

const ActivityHeader: FC<PGCRComponent> = (props) => {
    const { activity, placements } = props
    if (placements && activity) activity.placements = placements
    return (
      <>
        <div id={styles["activity-card-header"]}>
          <div id={styles["left-info"]}>
            <div id={styles["raid-info-top"]}>
              <span id={styles["completion-time"]}>{
                activity?.completionDate.toLocaleDateString(navigator.language, {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                }) ?? "Loading..."}
              </span>
            </div>
            <div id={styles["raid-name"]}>
              <span>{activity?.name.toUpperCase() ?? "Loading..."}</span>
            </div>
            {activity?.speed.fresh === null ? <div id={styles["cp-error"]}>
              <p>{checkpointDisclaimer}</p>
            </div> : <></>}
          </div>
          <div id={styles["right-info"]}>
            <div className={styles.duration}>
              {activity?.speed.complete ? activity?.speed.duration.split(" ").map((t, idx) => (
                <span key={idx}>
                  <b>{t.substring(0, t.length - 1)}</b>
                  {t[t.length - 1]}
                </span>
              )) : <span><b>{incomplete}</b></span>}
            </div>
          </div>
        </div>
        <div id={styles["tags-container"]}>
          {activity?.tags.map((tag, idx) => (
            <div key={idx} className={[styles["soft-rectangle"], styles.tag].join(" ")}>{tag}</div>
          ))}
        </div>
      </>
    );
  }

export default ActivityHeader;
