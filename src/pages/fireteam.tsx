import styles from "~/styles/pages/fireteam.module.css"
import { NextPage } from "next"
import { z } from "zod"
import { zUniqueDestinyProfile } from "~/util/zod"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import FireteamMember from "~/components/fireteam/FireteamMember"
import FireteamHeader from "~/components/fireteam/FireteamHeader"

export type Member = z.infer<typeof zUniqueDestinyProfile>

const FireteamPage: NextPage<{}> = () => {
    const router = useRouter()
    const [members, setMembers] = useState<Member[]>([])

    useEffect(() => {
        try {
            const parsed = z
                .object({
                    members: z.string().transform(str =>
                        z.array(zUniqueDestinyProfile).parse(
                            str.split(", ").map(p => {
                                const [destinyMembershipType, destinyMembershipId] = p.split("+")
                                return { destinyMembershipType, destinyMembershipId }
                            })
                        )
                    )
                })
                .parse(Object.fromEntries(new URLSearchParams(location.search)))
            return setMembers(parsed.members)
        } catch {}
    }, [])

    function removeMember(member: Member) {
        setMembers(old => {
            const newMembers = old.filter(
                mem => mem.destinyMembershipId !== member.destinyMembershipId
            )
            updateRouter(newMembers)
            return newMembers
        })
    }

    function addMember(member: Member) {
        setMembers(old => {
            if (old.find(o => o.destinyMembershipId === member.destinyMembershipId)) return old
            const newMembers = [member, ...old]
            updateRouter(newMembers)
            return newMembers
        })
    }

    function updateRouter(members: Member[]) {
        router.push(
            {
                query: {
                    members: members
                        .map(m => m.destinyMembershipType + "+" + m.destinyMembershipId)
                        .join(", ")
                }
            },
            undefined,
            { shallow: true }
        )
    }

    return (
        <main className={styles["main"]}>
            <FireteamHeader addMember={addMember} />
            <div className={styles["players"]}>
                {members?.map((member, idx) => (
                    <FireteamMember key={idx} member={member} remove={() => removeMember(member)} />
                ))}
            </div>
        </main>
    )
}

export default FireteamPage
