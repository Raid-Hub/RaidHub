import { FC } from 'react';
import { PGCRComponent } from '../../pages/pgcr/[activityId]'
import styles from '../../styles/pgcr.module.css';

const SummaryStats: FC<PGCRComponent> = (props) => {
  const stats = props.activity?.stats
  const statsData: {
    icon: string,
    name: string,
    value: number | string
  }[] = [
      {
        icon: "/icons/question_mark.png",
        name: "MVP",
        value: stats?.mvp.toUpperCase() ?? "???"
      },
      {
        icon: "/icons/kills.png",
        name: "TOTAL KILLS",
        value: stats?.totalKills ?? 0
      },
      {
        icon: "/icons/deaths.png",
        name: "TOTAL DEATHS",
        value: stats?.totalDeaths ?? 0
      },
      {
        icon: "/icons/question_mark.png",
        name: "ABILITY KILLS %",
        value: (stats?.killsTypeRatio.ability ?? 0) + "%"
      },
      {
        icon: "/icons/question_mark.png",
        name: "TOTAL CHARACTERS USED",
        value: stats?.totalCharactersUsed ?? 0
      },
      {
        icon: "/icons/question_mark.png",
        name: "STAT PLACEHOLDER",
        value: 0
      },
      {
        icon: "/icons/question_mark.png",
        name: "STAT PLACEHOLDER 2",
        value: "None"
      },
      {
        icon: "/icons/question_mark.png",
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
