import { useSession } from "next-auth/react"
import styles from "~/styles/pages/pgcr.module.css"
import { useLocale } from "~/components/app/LocaleManager"
import ToggleSwitch from "~/components/reusable/ToggleSwitch"
import PinPCRCell from "./PinPGCRCell"
import { usePGCRContext } from "../PGCR"
import CameraButton from "./CameraButton"

export type PGCRSettings = {
    showScore: boolean
}

const PGCRSettingsMenu = ({
    value,
    save
}: {
    value: PGCRSettings
    save: (saver: (val: PGCRSettings) => PGCRSettings) => void
}) => {
    const { data: sessionData } = useSession()
    const { data: pgcr, isLoading } = usePGCRContext()
    const { strings } = useLocale()

    return !isLoading ? (
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

            <hr />
            <div>
                <span>{strings.screenshot}</span>
                <CameraButton />
            </div>
            {/* Check PGCR Equals Raid Mode - Probably can do this for pin.*/}
            {sessionData?.user.destinyMembershipId &&
                pgcr.activityDetails.mode == 4 &&
                pgcr.players
                    ?.map(p => p.membershipId)
                    .includes(sessionData.user.destinyMembershipId) && (
                    <>
                        <hr />
                        <PinPCRCell />
                    </>
                )}
        </div>
    ) : null
}

export default PGCRSettingsMenu
