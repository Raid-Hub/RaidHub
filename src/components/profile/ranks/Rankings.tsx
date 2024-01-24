import styles from "~/styles/pages/profile/ranks.module.css"
import { RaidHubPlayerResponse } from "~/types/raidhub-api"

const ProfileRankings = ({ players }: { players: RaidHubPlayerResponse[] }) => {
    return (
        <div className={styles["ranks"]}>
            {players.map((p, i) => (
                <div key={i}>
                    <h1>{p.player.membershipType}</h1>
                    {Object.entries(p.stats.global).map(([key, stats]) => (
                        <div key={key}>
                            <h3>{key}</h3>
                            <div>{stats.rank}</div>
                            <div>{stats.value}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default ProfileRankings
