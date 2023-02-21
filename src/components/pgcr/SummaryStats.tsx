import { DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas';
import React from 'react';
import { ActivityData } from '../../models/pgcr/ActivityData'
import { PGCRMember } from '../../models/pgcr/Entry';
import { PGCRComponent } from '../../pages/pgcr/[activityId]'
import styles from '../../styles/pgcr.module.css';
import { ActivityStats } from '../../models/pgcr/ActivityStats';


export class SummaryStats extends React.Component<PGCRComponent> {
  constructor(props: PGCRComponent) {
    super(props)
  }

  render() {
    let stats: ActivityStats | null = null
    if (this.props.pgcr && this.props.members) {
      stats = new ActivityData(this.props.pgcr, this.props.members).stats
    }
    const statsData: {
      icon: string,
      name: string,
      value: number | string
    }[] = [
        {
          icon: "/images/flawless_diamond.png",
          name: "MVP",
          value: stats?.mvp.toUpperCase() ?? "???"
        },
        {
          icon: "/images/flawless_diamond.png",
          name: "TOTAL KILLS",
          value: stats?.totalKills ?? 0
        },
        {
          icon: "/images/flawless_diamond.png",
          name: "TOTAL DEATHS",
          value: stats?.totalDeaths ?? 0
        },
        {
          icon: "/images/flawless_diamond.png",
          name: "ABILITY KILLS %",
          value: (stats?.killsTypeRatio.ability ?? 0) + "%"
        },
        {
          icon: "/images/flawless_diamond.png",
          name: "TOTAL CHARACTERS USED",
          value: stats?.totalCharactersUsed ?? 0
        },
      ]
    return (<>
      {statsData.map((stat, idx) => (
        <div key={idx} className={[styles["soft-rectangle"], styles["summary-stat"]].join(" ")}>
          <div className={styles["summary-stat-content"]}>
            <img src={stat.icon} alt={stat.name + ": " + stat.value} />
            <div className={styles["summary-stat-info"]}>
              <span className={styles["summary-stat-name"]}>{stat.name}</span>
              <span className={styles["summary-stat-value"]}>{stat.value}</span>
            </div>
          </div>
        </div>
      ))}
    </>)
  }
}
