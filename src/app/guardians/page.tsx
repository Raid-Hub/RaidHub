"use client"

import InspectionHeader from "components_old/guardians/InspectionHeader"
import Player from "components_old/guardians/Player"
import { createRef, useState } from "react"
import { PortalProvider } from "~/components/Portal"
import { Grid } from "~/components/layout/Grid"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { numberString } from "~/util/zod"
import { ExpandedContext } from "./context"

export default function Page() {
    const params = useQueryParams<{
        membershipId: string
    }>()
    const membershipIds = new Set(
        params.getAll("membershipId").filter(m => numberString.safeParse(m).success)
    )

    const [isExpanded, setExpanded] = useLocalStorage<boolean>("expanded-inspect", false)

    function addMember(membershipId: string, isFireteamIncluded: boolean) {
        if (membershipIds.has(membershipId)) {
            // remove the old membershipId from the array of membershipIds
            params.remove("membershipId", membershipId)
            params.append("membershipId", membershipId)

            if (isFireteamIncluded) {
                setFireteamIncluded(prev => [...prev, membershipId])
            } else {
                setFireteamIncluded(prev => prev.filter(id => id !== membershipId))
            }
        } else {
            params.append("membershipId", membershipId)
        }
    }

    const [fireteamIncluded, setFireteamIncluded] = useState<Array<string>>([])

    const playersRef = createRef<HTMLDivElement>()
    return (
        <PortalProvider target={playersRef}>
            <InspectionHeader
                addMember={addMember}
                memberIds={membershipIds}
                clearAllMembers={() => params.remove("membershipId")}
                setExpanded={setExpanded}
                isExpanded={isExpanded}
            />
            <ExpandedContext.Provider value={isExpanded}>
                <Grid ref={playersRef}>
                    {Array.from(membershipIds).map(membershipId => (
                        <Player
                            key={membershipId}
                            membershipId={membershipId}
                            remove={() => params.remove("membershipId", membershipId)}
                            add={addMember}
                            isFireteamIncluded={fireteamIncluded.includes(membershipId)}
                        />
                    ))}
                </Grid>
            </ExpandedContext.Provider>
        </PortalProvider>
    )
}
