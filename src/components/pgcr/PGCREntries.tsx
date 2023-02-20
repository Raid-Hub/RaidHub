import React from 'react';
import { PGCRMember } from '../../models/pgcr/Entry'
import { DestinyComponentType, DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas'
import { PGCRComponentProps } from '../../pages/pgcr/[activityId]';
import styles from '../../styles/pgcr.module.css'
import { getProfile } from 'oodestiny/endpoints/Destiny2';


export class PGCREntries extends React.Component<PGCRComponentProps> {
  render() {
    let members: PGCRMember[] = []
    const dict: Record<string, DestinyPostGameCarnageReportEntry[]> = {}
    if (this.props.pgcr) {
      this.props.pgcr.entries.forEach(entry => (dict[entry.player.destinyUserInfo.membershipId] ??= []).push(entry))
      members = Object.entries(dict).map(([id, vals]) => new PGCRMember(id, vals))
    }
    const cardLayout = members.length < 4 ? styles["members-low"] : (members.length % 2 ? styles["members-odd"] : styles["members-even"])
    return (
      <div id={styles["members"]} className={cardLayout}>
        {members.map((member, idx) => {
          const emblemBackground = this.props.emblems?.[member.characterIds[0]] ?? ""
          return (
            <div key={idx} className={[styles["soft-rectangle"], styles["entry-card"]].join(' ')}>
              <img src={emblemBackground} alt="Emblem Image"></img>
              <div className={styles["member-card-container"]}>
                <div className={styles["class-logo"]}></div>
                <div className={styles["member-properties"]}>
                  <div className={styles["member-name"]}>
                    <span>{member.displayName}</span>
                  </div>
                  <div className={styles["member-class"]}>
                    <span>{member.characterClass}</span>
                  </div>
                </div>
                <div className={styles["flawless-diamond"]}>
                  {member.flawless ? <img src="/images/flawless_diamond.png"></img> : <></>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    );
  }
}
