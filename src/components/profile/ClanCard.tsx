import { UserInfoCard } from "oodestiny/schemas"
import { useClan } from "../../hooks/clan"
import styles from "../../styles/profile.module.css"
import Loading from "../Loading"
import ClanBanner from "./ClanBanner"

type ClanCardProps = {
    info: UserInfoCard
}

const ClanCard = ({ info }: ClanCardProps) => {
    const { clan, isLoading: isClanLoading } = useClan(info)
    return (
        <div className={styles["clan"]}>
            {isClanLoading ? (
                <div className={styles["clan-img"]}>
                    <Loading />
                </div>
            ) : (
                <ClanBanner {...clan!.clanBanner} />
            )}

            <div className={styles["clan-desc"]}>
                <span className={styles["desc-title"]}>
                    {clan?.name.replace(/[ㅤ ㅤ]/g, "").trim() +
                        ` [${clan?.clanInfo.clanCallsign}]`}
                </span>
                <span className={styles["desc-subtitle"]}>{clan?.motto}</span>
                <div className={styles["desc-text-wrapper"]}>
                    <p className={styles["desc-text"]}>{urlHighlight(clan?.about ?? "")}</p>
                </div>

                <div className={styles["description-list"]}>
                    <div className={styles["description-list-item"]}>
                        <img src="/icons/diamond.png" alt="" />
                        <p>
                            Raid Clears <span>x999</span>
                        </p>
                    </div>

                    <div className={styles["description-list-item"]}>
                        <img src="/icons/diamond.png" alt="" />
                        <p>
                            Solos <span>x999</span>
                        </p>
                    </div>

                    <div className={styles["description-list-item"]}>
                        <img src="/icons/diamond.png" alt="" />
                        <p>
                            Flawless Masters <span>x999</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const urlRegex =
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim

function urlHighlight(str: string): JSX.Element[] {
    const elements: JSX.Element[] = []
    let match
    let lastIndex = 0
    while ((match = urlRegex.exec(str))) {
        // Capture the non-matching substring before the matched URL
        if (match.index > lastIndex) {
            elements.push(<span key={lastIndex}>{str.substring(lastIndex, match.index)}</span>)
        }
        // Capture the matched URL
        let url = match[0]
        elements.push(
            <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
            </a>
        )
        lastIndex = urlRegex.lastIndex
    }
    // Capture the final non-matching substring after the last matched URL
    if (lastIndex < str.length) {
        elements.push(<span key={lastIndex}>{str.substring(lastIndex)}</span>)
    }
    return elements
}

export default ClanCard
