import styles from "../../../styles/pages/profile/mid.module.css"
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
    return (
        <div className={styles["layout-toggle"]}>
            <span
                className={styles["description-toggle"] + (!layout ? " " + styles["checked"] : "")}
                onClick={() => handleLayoutToggle(!!Layout.DotCharts)}>
                Raids
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
                Recent
            </span>
        </div>
    )
}

export default LayoutToggle
