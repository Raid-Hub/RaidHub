import { useSession } from "next-auth/react"
import { UseLocalStorage } from "../../hooks/util/useLocalStorage"
import PGCRPlayer from "../../models/pgcr/Player"
import styles from "../../styles/pages/pgcr.module.css"
import { useLocale } from "../app/LocaleManager"
import ToggleSwitch from "../reusable/ToggleSwitch"
import Image from "next/image"
import { Pin } from "../../images/icons"
import { updateCurrentUser } from "../../services/app/updateCurrentUser"

export type PGCRSettings = {
    showScore: boolean
}

type PGCRSettingsMenuProps = UseLocalStorage<PGCRSettings> & {
    players: PGCRPlayer[] | null
}

const PGCRSettingsMenu = ({ value, save, players }: PGCRSettingsMenuProps) => {
    const { data: sessionData } = useSession()
    const { strings } = useLocale()

    const handlePinClick = () => {
        updateCurrentUser({})
    }

    return (
        <div className={styles["settings-menu-dropdown"]}>
            <div>
                <span>{strings.showScore}</span>
                <ToggleSwitch
                    label="show-score"
                    value={value?.showScore ?? false}
                    onToggle={state => save(old => ({ ...old, showScore: state }))}
                    size={20}
                />
            </div>

            <hr
                style={{
                    border: "none",
                    height: "1px",
                    width: "100%",
                    backgroundColor: "#888888"
                }}
            />

            {players
                ?.map(p => p.membershipId)
                .includes(sessionData?.user.destinyMembershipId as string) && (
                <div>
                    <span>{strings.pinThisActivity}</span>
                    <div
                        style={{ width: "50%", position: "relative", cursor: "pointer" }}
                        onClick={handlePinClick}>
                        <Image
                            src={Pin}
                            alt={strings.pinThisActivity}
                            fill
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default PGCRSettingsMenu
