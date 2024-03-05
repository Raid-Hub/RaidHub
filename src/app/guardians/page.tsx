"use client"

import { createRef } from "react"
import { PortalProvider } from "~/components/Portal"
import InspectionHeader from "~/components/__deprecated__/guardians/InspectionHeader"
import Player from "~/components/__deprecated__/guardians/Player"
import { Grid } from "~/components/layout/Grid"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { numberString } from "~/util/zod"
import { ExpandedContext } from "./context"

export default function Page() {
    const playersRef = createRef<HTMLDivElement>()
    const params = useQueryParams<{
        membershipId: string
    }>()

    const membershipIds = new Set(
        params.getAll("membershipId").filter(m => numberString.safeParse(m).success)
    )
    const [isExpanded, setExpanded] = useLocalStorage<boolean>("expanded-inspect", false)

    return (
        <PortalProvider target={playersRef}>
            <InspectionHeader setExpanded={setExpanded} isExpanded={isExpanded} />
            <ExpandedContext.Provider value={isExpanded}>
                <Grid ref={playersRef} $relative $minCardWidth={325}>
                    {Array.from(membershipIds).map(membershipId => (
                        <Player
                            key={membershipId}
                            membershipId={membershipId}
                            remove={() => params.remove("membershipId", membershipId)}
                        />
                    ))}
                </Grid>
            </ExpandedContext.Provider>
        </PortalProvider>
    )
}
