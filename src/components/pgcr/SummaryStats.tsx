import { FC } from 'react';
import { PGCRComponent } from '../../pages/pgcr/[activityId]'
import styles from '../../styles/pgcr.module.css';
import { Icons } from '../../util/icons';

const SummaryStats: FC<PGCRComponent> = (props) => {
  const stats = props.activity?.stats
  const statsData: {
    icon: string,
    name: string,
    value: number | string
  }[] = [
      {
        icon: Icons.MVP,
        name: "MVP",
        value: stats?.mvp.toUpperCase() ?? "???"
      },
      {
        icon: Icons.KILLS,
        name: "TOTAL KILLS",
        value: stats?.totalKills ?? 0
      },
      {
        icon: Icons.DEATHS,
        name: "TOTAL DEATHS",
        value: stats?.totalDeaths ?? 0
      },
      {
        icon: Icons.ABILITIES,
        name: "ABILITY KILLS %",
        value: (stats?.killsTypeRatio.ability ?? 0) + "%"
      },
      {
        icon: Icons.UNKNOWN,
        name: "TOTAL CHARACTERS USED",
        value: stats?.totalCharactersUsed ?? 0
      },
      {
        icon: Icons.UNKNOWN,
        name: "MOST USED WEAPON",
        value: stats?.mostUsedWeapon?.name.toUpperCase() ?? "None"
      },
      {
        icon: Icons.UNKNOWN,
        name: "STAT PLACEHOLDER",
        value: 0
      },
      {
        icon: Icons.UNKNOWN,
        name: "STAT PLACEHOLDER 2",
        value: "None"
      },
      {
        icon: Icons.UNKNOWN,
        name: "STAT PLACEHOLDER 3",
        value: "123"
      },
    ]
  return (<>
    {statsData.map((stat, idx) => (
      <div key={idx} className={[styles["soft-rectangle"], styles["summary-stat"]].join(" ")}>
        <div className={styles["summary-stat-content"]}>
          <img
            src={stat.icon}
            alt={stat.name + ": " + stat.value}
            className={styles["stat-icon"]} />
          <div className={styles["summary-stat-info"]}>
            <span className={[styles["summary-stat-name"], styles["contained-span"]].join(" ")}>{stat.name}</span>
            <span className={[styles["summary-stat-value"], styles["contained-span"]].join(" ")}>{stat.value}</span>
          </div>
        </div>
      </div>
    ))}
  </>)
}

export default SummaryStats
