import { LeaderboardEntryComponent } from "~/app/leaderboards/LeaderboardEntryComponent"
import { Flex } from "~/components/layout/Flex"

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
    url?: string
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
    icons?: Record<number, JSX.Element>
}) => {
    return (
        <Flex $direction="column" as="section">
            {props.entries.map(e => (
                <LeaderboardEntryComponent
                    key={e.id}
                    format={props.format}
                    placementIcon={props.icons?.[e.rank]}
                    {...e}
                />
            ))}
        </Flex>
    )
}
