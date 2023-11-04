import styles from "~/styles/pages/inpsect.module.css"
import { NextPage } from "next"
import { z } from "zod"
import { useRouter } from "next/router"
import { createContext, createRef, useContext, useEffect, useState } from "react"
import { GuardianData } from "~/types/guardian"
import InspectionHeader from "~/components/guardians/InspectionHeader"
import Player from "~/components/guardians/Player"
import { PortalProvider } from "~/components/reusable/Portal"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"

const InpsectionPage: NextPage<{}> = () => {
    const router = useRouter()
    const [members, setMembers] = useState<Map<string, GuardianData>>(new Map())

    // parse query params on mount
    useEffect(() => {
        try {
            const parsed = z
                .object({
                    ids: z
                        .string()
                        .transform(str => z.array(z.string().regex(/^\d+$/)).parse(str.split(", ")))
                })
                .parse(Object.fromEntries(new URLSearchParams(location.search)))

            setMembers(
                new Map(
                    parsed.ids.map(id => [
                        id,
                        {
                            membershipId: id,
                            isFireteamIncluded: false
                        }
                    ])
                )
            )
        } catch {}
    }, [])

    function removeMember(member: GuardianData) {
        setMembers(old => {
            const newMembers = new Map(Array.from(old))
            newMembers.delete(member.membershipId)
            updateRouter(newMembers)
            return newMembers
        })
    }

    function addMember(member: GuardianData) {
        setMembers(old => {
            const newMembers = new Map([[member.membershipId, member]])
            Array.from(old.values()).forEach(member => {
                if (!newMembers.has(member.membershipId)) {
                    newMembers.set(member.membershipId, member)
                }
            })
            updateRouter(newMembers)
            return newMembers
        })
    }
    function addMembers(members: GuardianData[]) {
        setMembers(old => {
            const newMembers = new Map(members.map(m => [m.membershipId, m] as const))
            Array.from(old.values()).forEach(member => {
                if (!newMembers.has(member.membershipId)) {
                    newMembers.set(member.membershipId, member)
                }
            })
            updateRouter(newMembers)
            return newMembers
        })
    }

    function updateRouter(members: Map<string, GuardianData>) {
        router.push(
            {
                query: {
                    ids: Array.from(members.keys()).join(", ")
                }
            },
            undefined,
            { shallow: true }
        )
    }

    const { save: setExpanded, value: isExpanded } = useLocalStorage<boolean>(
        "expanded-inspect",
        false
    )
    const playersRef = createRef<HTMLDivElement>()
    return (
        <main className={styles["main"]}>
            <PortalProvider target={playersRef}>
                <InspectionHeader
                    addMember={addMember}
                    memberIds={Array.from(members.keys())}
                    clearAllMembers={() => setMembers(new Map())}
                    setExpanded={setExpanded}
                    isExpanded={isExpanded}
                />
                <div className={styles["players"]} ref={playersRef}>
                    {Array.from(members?.values() ?? []).map(member => (
                        <ExpandedContext.Provider value={isExpanded} key={member.membershipId}>
                            <Player
                                member={member}
                                remove={() => removeMember(member)}
                                addMembers={addMembers}
                            />
                        </ExpandedContext.Provider>
                    ))}
                </div>
            </PortalProvider>
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
