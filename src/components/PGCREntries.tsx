import React from 'react';
import { PGCRMember } from '../models/pgcr/Entry'
import { DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas'
import { PGCRComponentProps } from '../pages/pgcr/[activityId]';
import styles from '../styles/pgcr.module.css'


export class PGCREntries extends React.Component<PGCRComponentProps> {
  render() {
    let members: PGCRMember[] = [];
    if (this.props.data) {
      const dict: Record<string, DestinyPostGameCarnageReportEntry[]> = {}
      this.props.data.entries.forEach(entry => (dict[entry.player.destinyUserInfo.membershipId] ??= []).push(entry))
      members = Object.entries(dict).map(([id, vals]) => new PGCRMember(id, vals))
      console.log(members)
    }
    const cardLayout = members.length < 4 ? styles["members-low"] : (members.length % 2 ? styles["members-odd"] : styles["members-even"])
    return (
      <div id={styles["members"]} className={cardLayout}>
        {members.map((member, idx) => (
          <div key={idx} className={[styles["soft-rectangle"], styles["member-card"]].join(' ')}>
            <div className={styles["class-logo"]}></div>
            <div className={styles["member-properties"]}>
              <div className={styles["member-name"]}>
                <span>{member.displayName}</span>
              </div>
              <div className={styles["member-class"]}>

              </div>
            </div>
            <div className={styles["flawless-diamond"]}></div>
          </div>
        ))}
      </div>
    );
  }
}
