import styles from "~/styles/pages/inpsect.module.css"
import { NextPage } from "next"
import { z } from "zod"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { InpsectionMemberData } from "~/types/profile"
import InspectionHeader from "~/components/inpsect/InspectionHeader"
import Player from "~/components/inpsect/Player"

const InpsectionPage: NextPage<{}> = () => {
    const router = useRouter()
    const [members, setMembers] = useState<Map<string, InpsectionMemberData>>(new Map())

    // parse query params on mount
    useEffect(() => {
        try {
            const parsed = z
                .object({
                    members: z
                        .string()
                        .transform(str => z.array(z.string().regex(/^\d+$/)).parse(str.split(", ")))
                })
                .parse(Object.fromEntries(new URLSearchParams(location.search)))

            setMembers(
                new Map(
                    parsed.members.map(id => [
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

    function removeMember(member: InpsectionMemberData) {
        setMembers(old => {
            const newMembers = new Map(Array.from(old))
            newMembers.delete(member.membershipId)
            updateRouter(newMembers)
            return newMembers
        })
    }

    function addMember(member: InpsectionMemberData) {
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
    function addMembers(members: InpsectionMemberData[]) {
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

    function updateRouter(members: Map<string, InpsectionMemberData>) {
        router.push(
            {
                query: {
                    members: Array.from(members.keys()).join(", ")
                }
            },
            undefined,
            { shallow: true }
        )
    }
    return (
        <main className={styles["main"]}>
            <InspectionHeader
                addMember={addMember}
                memberIds={Array.from(members.keys())}
                clearAllMembers={() => setMembers(new Map())}
            />
            <div className={styles["players"]}>
                {Array.from(members?.values() ?? []).map((member, idx) => (
                    <Player
                        key={idx}
                        member={member}
                        remove={() => removeMember(member)}
                        addMembers={addMembers}
                    />
                ))}
            </div>
        </main>
    )
}

export default InpsectionPage
