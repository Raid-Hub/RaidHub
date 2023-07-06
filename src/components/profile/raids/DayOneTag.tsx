import styles from "../../../styles/profile.module.css"
import Link from "next/link"
import { Raid, wfRaceMode } from "../../../util/destiny/raid"
import { useLocale } from "../../app/LanguageProvider"

type DayOneTagProps = {
    instanceId?: string
    raid: Raid
    placement?: number
    asterisk?: boolean
}
const DayOneTag = (props: DayOneTagProps) => {
    const className = styles["clickable-tag"]
    return props.instanceId ? (
        <Link className={className} href={`/pgcr/${props.instanceId}`}>
            <InnerTag {...props} />
        </Link>
    ) : (
        <div className={className}>
            <InnerTag {...props} />
        </div>
    )
}

const InnerTag = ({ raid, placement, asterisk }: DayOneTagProps) => {
    const { strings } = useLocale()
    return (
        <span>
            {strings.tags[wfRaceMode(raid)]}
            {asterisk ? "*" : ""}
            {placement ? ` #${placement}` : ""}
        </span>
    )
}

export default DayOneTag
