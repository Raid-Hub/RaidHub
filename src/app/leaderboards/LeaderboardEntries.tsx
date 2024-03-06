"use client"

import { useSearchParams } from "next/navigation"
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
    position: number
    value: number
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
    const params = useSearchParams()
    params.get("position")
    return (
        <Flex
            $direction="row"
            $wrap
            as="section"
            $gap={1}
            $padding={0}
            style={{ flexBasis: "max-content" }}>
            {props.entries.map(e => (
                <LeaderboardEntryComponent
                    key={e.position}
                    placementIcon={props.icons?.[e.rank]}
                    isTargetted={String(e.position) === params.get("position")}
                    {...e}
                />
            ))}
        </Flex>
    )
}
