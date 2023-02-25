import React from 'react';
import { PGCRMember } from '../../models/pgcr/Entry'
import styles from '../../styles/pgcr.module.css'
import { PGCRComponent } from '../../pages/pgcr/[activityId]';
import { CharacterLogos } from '../../util/character-logos';
import { ColorFilm, Raid } from '../../util/raid';

interface EntriesTableState {
  memberIndex: number
  characterIndex: number
}

export class PGCREntries extends React.Component<PGCRComponent & { raid: Raid }, EntriesTableState> {
  constructor(props: PGCRComponent & { raid: Raid }) {
    super(props)
    this.state = {
      /** Represents the index the user is currently inspecting */
      memberIndex: -1,
      characterIndex: -1
    }
  }
  render() {
    const members: PGCRMember[] = this.props.members ?? new Array(6).fill({});
    const cardLayout = members.length < 4 && this.state.memberIndex == -1
      ? styles["members-low"]
      : (members.length % 2 && this.state.memberIndex == -1 ? styles["members-odd"] : styles["members-even"])
    return (
      <div id={styles["members"]} className={cardLayout}>
        {this.state.memberIndex === -1
          ? members.map((member, idx) => this.memberToCard(member, idx, this.props.raid))
          : <>
            {this.memberToCard(members[this.state.memberIndex], this.state.memberIndex, this.props.raid)}
            <div className={styles["class-button-container"]}>
              {members[this.state.memberIndex].characters.map((character, idx) => (
                <div key={idx}
                  className={[styles["soft-rectangle"], idx === this.state.characterIndex ? styles["selected"] : styles["selectable"], styles["class-button"]].join(" ")}
                  onClick={() => this.updateCharacterIndex(idx)}>
                  <img src={CharacterLogos[character.className].icon} />
                </div>
              ))}
            </div>
          </>}
      </div>
    );
  }

  private memberToCard(member: PGCRMember, index: number, raid: Raid) {
    const emblemBackground = this.props.emblems?.[member.characterIds[0]] ?? ""
    const { icon } = CharacterLogos[member.characters?.[0].className ?? "Guardian"];
    const displayClass = this.state.memberIndex === index ? styles["selected"] : styles["selectable"]
    console.log(ColorFilm[raid])
    return (
      <div key={index}
        className={[styles["soft-rectangle"], styles["entry-card"], styles["selectable"], displayClass].join(' ')}
        onClick={() => this.updateMemberIndex(index)}>
        <img src={emblemBackground} alt={"Emblem for " + member.displayName} />
        <div className={[styles["member-card-container"], styles[ColorFilm[raid]]].join(" ")}>
          <div className={styles["class-logo"]} >
            {member.characters ? <img src={icon} /> : <></>}
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
            {member.flawless ? <img src="/icons/flawless_diamond.png" alt={member.displayName + " went flawless this raid"} />
              : <></>}
          </div>
        </div>
      </div>
    )
  }

  private updateMemberIndex(clicked: number) {
    if (this.state.memberIndex === clicked) {
      this.setState({
        memberIndex: -1,
        characterIndex: -1
      })
    } else {
      this.setState({
        memberIndex: clicked
      })
    }
  }

  private updateCharacterIndex(clicked: number) {
    if (this.state.characterIndex === clicked) {
      this.setState({
        characterIndex: -1
      })
    } else {
      this.setState({
        characterIndex: clicked
      })
    }
  }
}
