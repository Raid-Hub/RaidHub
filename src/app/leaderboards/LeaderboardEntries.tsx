import LeaderboardEntryComponent from "components_old/leaderboards/LeaderboardEntryComponent"

export type LeaderboardEntryPlayer = {
    id: string
    displayName: string
    iconUrl?: string
    url?: string
}
export type LeaderboardEntry = {
    rank: number
    value: number
    id: string
    url: string
} & (
    | {
          type: "player"
          player: LeaderboardEntryPlayer
      }
    | {
          type: "team"
          team: LeaderboardEntryPlayer[]
      }
)

export const LeaderboardEntries = (props: {
    entries: LeaderboardEntry[]
    format: "time" | "number"
}) => {
    return (
        <div>
            {props.entries.map(e => (
                <LeaderboardEntryComponent key={e.id} format={props.format} {...e} />
            ))}
        </div>
    )
}
