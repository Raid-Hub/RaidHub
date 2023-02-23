import React from 'react';
import { ActivityData } from '../../models/pgcr/ActivityData'
import { PGCRComponent } from '../../pages/pgcr/[activityId]'
import styles from '../../styles/pgcr.module.css';

const checkpointDisclaimer = "Note: this report may or may not be a checkpoint due to API issues from Season of the Hunt through Season of the Risen"
const incomplete = "Incomplete"

export class ActivityHeader extends React.Component<PGCRComponent> {
  private data: ActivityData | null = null
  render() {
    if (!this.data && this.props.pgcr && this.props.members) {
      this.data = new ActivityData(this.props.pgcr, this.props.members)
    }
    if (this.props.placements && this.data) this.data.placements = this.props.placements
    return (
      <>
        <div id={styles["activity-card-header"]}>
          <div id={styles["left-info"]}>
            <div id={styles["raid-info-top"]}>
              <span id={styles["completion-time"]}>{
                this.data?.completionDate.toLocaleDateString(navigator.language, {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </div>
            <div id={styles["raid-name"]}>
              <span>{this.data?.name.toUpperCase()}</span>
            </div>
            {this.data?.speed.fresh === null ? <div id={styles["cp-error"]}>
              <p>{checkpointDisclaimer}</p>
            </div> : <></>}
          </div>
          <div id={styles["right-info"]}>
            <div className={styles.duration}>
              {this.data?.speed.complete ? this.data?.speed.duration.split(" ").map((t, idx) => (
                <span key={idx}>
                  <b>{t.substring(0, t.length - 1)}</b>
                  {t[t.length - 1]}
                </span>
              )) : <span><b>{incomplete}</b></span>}
            </div>
          </div>
        </div>
        <div id={styles["tags-container"]}>
          {this.data?.tags.map((tag, idx) => (
            <div key={idx} className={[styles["soft-rectangle"], styles.tag].join(" ")}>{tag}</div>
          ))}
        </div>
      </>
    );
  }
}
