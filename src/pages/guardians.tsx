import styles from "~/styles/pages/inpsect.module.css"
import { NextPage } from "next"
import { z } from "zod"
import { createContext, createRef, useContext, useState } from "react"
import InspectionHeader from "~/components/guardians/InspectionHeader"
import Player from "~/components/guardians/Player"
import { PortalProvider } from "~/components/reusable/Portal"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useSearchParams } from "~/hooks/util/useSearchParams"
import { numberString } from "~/util/zod"

const InpsectionPage: NextPage<{}> = () => {
    const {
        isReady,
        append,
        remove,
        query: membershipIds
    } = useSearchParams({
        decoder: query =>
            z
                .object({
                    membershipId: z.union([
                        numberString.transform(s => [s]),
                        z.array(numberString).default([])
                    ])
                })
                .transform(q => new Set(q.membershipId))
                .parse(query)
    })

    const { save: setExpanded, value: isExpanded } = useLocalStorage<boolean>(
        "expanded-inspect",
        false
    )

    function addMember(membershipId: string, isFireteamIncluded: boolean) {
        if (!isReady) return

        if (membershipIds.has(membershipId)) {
            remove("membershipId", membershipId)
            append("membershipId", membershipId)

            if (isFireteamIncluded) {
                setFireteamIncluded(prev => [...prev, membershipId])
            } else {
                setFireteamIncluded(prev => prev.filter(id => id !== membershipId))
            }
        } else {
            append("membershipId", membershipId)
        }
    }

    const [fireteamIncluded, setFireteamIncluded] = useState<Array<string>>([])

    const playersRef = createRef<HTMLDivElement>()
    return (
        <main className={styles["main"]}>
            {isReady && (
                <PortalProvider target={playersRef}>
                    <InspectionHeader
                        addMember={addMember}
                        memberIds={membershipIds}
                        clearAllMembers={() => remove("membershipId")}
                        setExpanded={setExpanded}
                        isExpanded={isExpanded}
                    />
                    <div className={styles["players"]} ref={playersRef}>
                        <ExpandedContext.Provider value={isExpanded}>
                            {Array.from(membershipIds).map(membershipId => (
                                <Player
                                    key={membershipId}
                                    membershipId={membershipId}
                                    remove={() => remove("membershipId", membershipId)}
                                    add={addMember}
                                    isFireteamIncluded={fireteamIncluded.includes(membershipId)}
                                />
                            ))}
                        </ExpandedContext.Provider>
                    </div>
                </PortalProvider>
            )}
        </main>
    )
}

export default InpsectionPage

const ExpandedContext = createContext<boolean | null>(null)

export function useExpandedContext() {
    const ctx = useContext(ExpandedContext)
    if (ctx == null) throw new Error("Cannot use context outside of a provider")
    return ctx
}
