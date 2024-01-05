import { ReactNode } from "react"
import styles from "./expanded-raid.module.css"
import { useActivitiesContext } from "../RaidContext"
import { Difficulty } from "~/types/raids"
import { useLocale } from "~/components/app/LocaleManager"

// todo
const versions = [Difficulty.NORMAL, Difficulty.MASTER]

export default function ExpandedStatsTable() {
    const { activities, isLoadingActivities } = useActivitiesContext()
    const { strings } = useLocale()

    if (isLoadingActivities) return <p>loading...</p>

    return (
        <table className={styles["table"]}>
            <thead>
                <tr>
                    <th />
                    <th>Total</th>
                    {versions.map((v, idx) => (
                        <th key={idx}>{strings.difficulty[v]}</th>
                    ))}
                </tr>
            </thead>
            <StatsRow
                header="Total Clears"
                values={versions.map(
                    v => activities.filter(a => a.difficulty === v && a.didMemberComplete).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
            />
            <StatsRow
                header="Fresh Clears"
                values={versions.map(
                    v =>
                        activities.filter(a => a.difficulty === v && a.fresh && a.didMemberComplete)
                            .size
                )}
                totalsReducer={(prev, curr) => prev + curr}
            />
            {/* <StatsRow header="sherpas" values={versions.map(v => "123")} /> */}
            {/* <StatsRow header="looted" values={versions.map(v => "123")} /> */}
            <StatsRow
                header="Lowmans"
                values={versions.map(
                    v =>
                        activities.filter(
                            a => a.difficulty === v && a.playerCount <= 3 && a.didMemberComplete
                        ).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
            />
            <StatsRow
                header="Flawlesses"
                values={versions.map(
                    v => activities.filter(a => a.difficulty === v && a.flawless).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
            />
            {/* // todo
            <StatsRow header="time played" values={versions.map(v => "123")} />
            <StatsRow header="kills" values={versions.map(v => "123")} />
            <StatsRow header="assists" values={versions.map(v => "123")} />
            <StatsRow header="deaths" values={versions.map(v => "123")} /> */}
        </table>
    )
}

export function StatsRow<T extends ReactNode>({
    header,
    values,
    totalsReducer
}: {
    header: string
    values: T[]
    totalsReducer: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T
}) {
    const totals = values.reduce(totalsReducer)
    return (
        <tbody>
            <tr>
                <th>{header}</th>
                <td>{totals}</td>
                {values.map((v, idx) => (
                    <td key={idx}>{v}</td>
                ))}
            </tr>
        </tbody>
    )
}
