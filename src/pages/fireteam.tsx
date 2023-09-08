import styles from "~/styles/pages/fireteam.module.css"
import { NextPage } from "next"
import { z } from "zod"
import { zUniqueDestinyProfile } from "~/util/zod"
import { useRouter } from "next/router"
import { useMemo } from "react"
import FireteamMember from "~/components/fireteam/FireteamMember"
import FireteamSidebar from "~/components/fireteam/FireteamSidebar"

const FireteamPage: NextPage<{}> = () => {
    const router = useRouter()

    const members = useMemo(() => {
        if (router.query) {
            try {
                const parsed = z
                    .object({
                        members: z.string().transform(str =>
                            z.array(zUniqueDestinyProfile).parse(
                                str.split(", ").map(p => {
                                    const [destinyMembershipType, destinyMembershipId] =
                                        p.split("+")
                                    return { destinyMembershipType, destinyMembershipId }
                                })
                            )
                        )
                    })
                    .parse(router.query)
                return parsed.members
            } catch {
                return []
            }
        }
    }, [router.query])

    return (
        <>
            <div className={styles["container"]}>
                <FireteamSidebar />
                <main>
                    <h1>Live Fireteam View</h1>

                    <section className={styles["players"]}>
                        {members?.map((member, idx) => (
                            <FireteamMember key={idx} member={member} />
                        ))}
                    </section>
                </main>
            </div>
        </>
    )
}

export default FireteamPage
