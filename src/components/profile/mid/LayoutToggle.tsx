import styles from "../../../styles/pages/profile/mid.module.css"
import { useLocale } from "../../app/LocaleManager"
import ToggleSwitch from "../../reusable/ToggleSwitch"

export enum Layout {
    DotCharts,
    RecentActivities
}

const LayoutToggle = ({
    handleLayoutToggle,
    layout
}: {
    layout: Layout
    handleLayoutToggle: (state: boolean) => void
}) => {
    const { strings } = useLocale()
    return (
        <div className={styles["layout-toggle"]}>
            <span
                className={styles["description-toggle"] + (!layout ? " " + styles["checked"] : "")}
                onClick={() => handleLayoutToggle(!!Layout.DotCharts)}>
                {strings.charts}
            </span>
            <ToggleSwitch
                size={30}
                onToggle={handleLayoutToggle}
                value={!!layout}
                label={"layout-toggle"}
            />
            <span
                className={styles["description-toggle"] + (!!layout ? " " + styles["checked"] : "")}
                onClick={() => handleLayoutToggle(!!Layout.RecentActivities)}>
                {strings.tiles}
            </span>
        </div>
    )
}

export default LayoutToggle
