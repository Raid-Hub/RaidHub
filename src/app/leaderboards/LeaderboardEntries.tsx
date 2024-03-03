"use client"

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
    id: string | number
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
    icons?: Record<number, JSX.Element>
}) => {
    return (
        <Flex $direction="row" $wrap as="section" $gap={0.25}>
            {props.entries.map(e => (
                <LeaderboardEntryComponent
                    key={e.id}
                    placementIcon={props.icons?.[e.rank]}
                    {...e}
                />
            ))}
        </Flex>
    )
}
