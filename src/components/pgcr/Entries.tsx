import { Component, FC } from 'react';
import Link from 'next/link';
import { PGCREntry, PGCRMember } from '../../models/pgcr/Entry'
import styles from '../../styles/pgcr.module.css'
import { PGCRComponent } from '../../pages/pgcr/[activityId]';
import { ColorFilm, Raid } from '../../util/raid';
import { Icons } from '../../util/icons';

interface EntriesTableState {
  memberIndex: number
  characterIndex: number
}

export class PGCREntries extends Component<PGCRComponent & { raid: Raid }, EntriesTableState> {
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
                <button key={idx}
                  className={[styles["soft-rectangle"], idx === this.state.characterIndex ? styles["selected"] : styles["selectable"], styles["class-button"]].join(" ")}
                  onClick={this.props.members ? () => this.updateCharacterIndex(idx) : undefined}>
                  <img src={character.logo} />
                </button>
              ))}
              <button
                className={[styles["member-profile"], styles["soft-rectangle"]].join(" ")}>
                <Link
                  href={this.memberProfile()}
                  className={styles["member-profile-link"]}>View Profile</Link>
              </button>
            </div>
            <PGCREntries.StatCard entry={members[this.state.memberIndex].characters[this.state.characterIndex] ?? members[this.state.memberIndex]} />
          </>}
      </div>
    );
  }

  /** Note this is not a functional component because it relies too much on state */
  private memberToCard(member: PGCRMember, index: number, raid: Raid): JSX.Element {
    const emblemBackground = this.props.emblems?.[member.characterIds[0]] ?? ""
    const dynamicCssClass = this.state.memberIndex === index ? styles["selected"] : styles["selectable"]
    const completionClass = member.didComplete ? "" : styles["dnf"]
    return (
      <button key={index}
        className={[styles["soft-rectangle"], styles["entry-card"], styles["selectable"], dynamicCssClass, completionClass].join(' ')}
        onClick={member.membershipId ? () => this.updateMemberIndex(index) : undefined}>
        <img
          src={emblemBackground}
          alt={"Emblem for " + (member.displayName ?? "Loading...")}
          className={styles["emblem"]} />
        <div className={[styles["member-card-container"], styles[ColorFilm[raid]]].join(" ")}>
          {this.state.memberIndex == -1
            ? <PGCREntries.MemberCard member={member} />
            : <PGCREntries.MemberInspectCard member={member} />}
        </div>
      </button>
    )
  }

  private static MemberCard: FC<{ member: PGCRMember }> = ({ member }) => {
    const icon = member.characters?.[0].logo
    const displayName = member.displayName ?? member.membershipId
    const displayClass = member.characterClass
    return (<>
      <div className={styles["class-logo"]} >
        {member.characters ? <img src={icon} /> : <></>}
      </div>
      <div className={styles["member-properties"]}>
        <div className={styles["member-name"]}>
          <span className={styles["contained-span"]}>{displayName}</span>
        </div>
        <div className={styles["member-class"]}>
          <span className={styles["contained-span"]}>{displayClass}</span>
        </div>
      </div>
      <div className={styles["flawless-diamond"]}>
        {member.flawless ? <img src="/icons/flawless_diamond.png" alt={member.displayName + " went flawless this raid"} />
          : <></>}
      </div>
    </>)
  }

  private static MemberInspectCard: FC<{ member: PGCRMember }> = ({ member }) => {
    const displayName = member.displayName ?? member.membershipId
    const displayClass = member.characterClass
    return (<>
      <div className={[styles["member-properties"], styles["centered"]].join(" ")}>
        <div className={styles["member-name"]}>
          <span className={styles["contained-span"]}>{displayName}</span>
        </div>
        <div className={styles["member-class"]}>
          <span className={styles["contained-span"]}>{displayClass}</span>
        </div>
      </div>
    </>)
  }

  private static StatCard: FC<{ entry: PGCREntry }> = ({ entry }) => {
    const statsData: {
      icon: string,
      name: string,
      value: number | string
    }[] = [
        {
          icon: Icons.Kills,
          name: "KILLS",
          value: entry.stats.kills
        },
        {
          icon: Icons.Deaths,
          name: "DEATHS",
          value: entry.stats.deaths
        },
        {
          icon: Icons.Assists,
          name: "ASSISTS",
          value: entry.stats.assists
        },
        {
          icon: Icons.Abilities,
          name: "ABILITY KILLS",
          value: entry.stats.abilityKills
        },
        {
          icon: Icons.Time,
          name: "TIME SPENT",
          value: entry.stats.timePlayed
        },
        {
          icon: Icons.Unknown,
          name: "PLACEHOLDER",
          value: "placeholder"
        }
      ]
    return (<>
      {statsData.map((stat, idx) => (
        <div key={idx} className={[styles["soft-rectangle"], styles["entry-card"], styles["character-stat"]].join(' ')}>
          <img
            src={stat.icon}
            alt={stat.name + ": " + stat.value}
            className={styles["stat-icon"]} />
          <div className={styles["summary-stat-info"]}>
            <span className={[styles["summary-stat-name"], styles["contained-span"]].join(" ")}>{stat.name}</span>
            <span className={[styles["summary-stat-value"], styles["contained-span"]].join(" ")}>{stat.value}</span>
          </div>
        </div>
      ))}
    </>)
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

  private memberProfile() {
    const member = this.props.members?.[this.state.memberIndex]
    const id = member?.membershipId
    const platform = member?.membershipType
    if (!id || !platform) return `/`
    return `/profile/${platform}/${id}`
  }
}
