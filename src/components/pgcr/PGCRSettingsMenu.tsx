import { UseLocalStorage } from "../../hooks/util/useLocalStorage"
import styles from "../../styles/pages/pgcr.module.css"
import { useLocale } from "../app/LocaleManager"
import ToggleSwitch from "../reusable/ToggleSwitch"

export type PGCRSettings = {
    showScore: boolean
}

type PGCRSettingsMenuProps = UseLocalStorage<PGCRSettings> & {}

const PGCRSettingsMenu = ({ value, save }: PGCRSettingsMenuProps) => {
    const { strings } = useLocale()
    return (
        <div className={styles["settings-menu-dropdown"]}>
            <div style={{ display: "flex", gap: "1em" }}>
                <div>{strings.showScore}</div>
                <ToggleSwitch
                    label="show-score"
                    value={value?.showScore ?? false}
                    onToggle={state => save(old => ({ ...old, showScore: state }))}
                    size={20}
                />
            </div>
        </div>
    )
}

export default PGCRSettingsMenu
