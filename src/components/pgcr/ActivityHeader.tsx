import React from 'react';
import { ActivityData } from '../../models/pgcr/ActivityData'
import { PGCRComponent } from '../../pages/pgcr/[activityId]'
import styles from '../../styles/pgcr.module.css';

const checkpointDisclaimer = "Note: this report may or may not be a checkpoint due to API issues from Season of the Hunt through Season of the Risen"
const incomplete = "Incomplete"

export class ActivityHeader extends React.Component<PGCRComponent> {
  render() {
    let data: ActivityData | null = null
    if (this.props.pgcr && this.props.members) {
      data = new ActivityData(this.props.pgcr, this.props.members)
    }
    return (
      <>
        <div id={styles["activity-card-header"]}>
          <div id={styles["left-info"]}>
            <div id={styles["raid-info-top"]}>
              <span id={styles["completion-time"]}>{
                data?.completionDate.toLocaleDateString(navigator.language, {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </div>
            <div id={styles["raid-name"]}>
              <span>{data?.name.toUpperCase()}</span>
            </div>
            {data?.speed.fresh === null ? <div id={styles["cp-error"]}>
              <p>{checkpointDisclaimer}</p>
            </div> : <></>}
          </div>
          <div id={styles["right-info"]}>
            <div className={styles.duration}>
              {data?.speed.complete ? data?.speed.duration.split(" ").map((t, idx) => (
                <span key={idx}>
                  <b>{t.substring(0, t.length - 1)}</b>
                  {t[t.length - 1]}
                </span>
              )) : <span><b>{incomplete}</b></span>}
            </div>
          </div>
        </div>
        <div id={styles["tags-container"]}>
          {data?.tags.map((tag, idx) => (
            <div key={idx} className={[styles["soft-rectangle"], styles.tag].join(" ")}>{tag}</div>
          ))}
        </div>
      </>
    );
  }
}
