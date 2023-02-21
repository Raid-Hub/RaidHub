import React from 'react';
import { PGCRMember } from '../../models/pgcr/Entry'
import styles from '../../styles/pgcr.module.css'
import { PGCRComponent } from '../../pages/pgcr/[activityId]';
interface PGCREntriesState {
  inspect: number
  displayClass: string
}
export class PGCREntries extends React.Component<PGCRComponent, PGCREntriesState> {
  constructor(props: PGCRComponent) {
    super(props)
    this.state = {
      /** Represents the index the user is currently inspecting */
      inspect: -1,
      displayClass: styles["entry-card-not-selected"]
    }
  }
  render() {
    const members: PGCRMember[] = this.props.members || new Array(6).fill({});
    const cardLayout = members.length < 4 ? styles["members-low"] : (members.length % 2 ? styles["members-odd"] : styles["members-even"])
    return (
      <div id={styles["members"]} className={cardLayout}>
        {this.state.inspect === -1
          ? members.map((member, idx) => this.memberToCard(member, idx))
          : <>
            {this.memberToCard(members[this.state.inspect], this.state.inspect)}
            <div>
              {members[this.state.inspect].characters.map((character, idx) => (
                <div key={idx}>
                  {character.className}
                </div>
              ))}
            </div>
          </>}
      </div>
    );
  }

  private updateInspect(clicked: number) {
    console.log(clicked)
    if (this.state.inspect === clicked) {
      this.setState({
        inspect: -1,
        displayClass: styles["entry-card-not-selected"]
      })
    } else {
      this.setState({
        inspect: clicked,
        displayClass: styles["entry-card-selected"]
      })
    }
  }

  private memberToCard(member: PGCRMember, index: number) {
    const emblemBackground = this.props.emblems?.[member.characterIds[0]] ?? ""
    return (
      <div key={index} className={[styles["soft-rectangle"], styles["entry-card"], this.state.displayClass].join(' ')}
        onClick={() => this.updateInspect(index)}>
        <img src={emblemBackground} alt={"Emblem for " + member.displayName} />
        <div className={styles["member-card-container"]} style={emblemBackground ? {} : { backgroundColor: "rgba(255, 199, 94, 0.166)" }}>
          <div className={styles["class-logo"]}>
            {
              // TODO
            }
          </div>
          <div className={styles["member-properties"]}>
            <div className={styles["member-name"]}>
              <span>{member.displayName}</span>
            </div>
            <div className={styles["member-class"]}>
              <span>{member.characterClass}</span>
            </div>
          </div>
          <div className={styles["flawless-diamond"]}>
            {member.flawless ? <img src="/images/flawless_diamond.png" alt={member.displayName + " went flawless this raid"} />
              : <></>}
          </div>
        </div>
      </div>
    )

  }
}
