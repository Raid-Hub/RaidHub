import { Member } from "~/pages/fireteam"
import styles from "~/styles/pages/fireteam.module.css"
import Search from "./Search"

export default function FireteamHeader({ addMember }: { addMember: (member: Member) => void }) {
    return (
        <div className={styles["header"]}>
            <h1>Fireteam View</h1>
            <div>Controls</div>
            <Search addMember={addMember} />
        </div>
    )
}
