import { ReactNode } from "react"
import styles from "./expanded-raid.module.css"
import { useActivitiesContext } from "../RaidContext"
import { Difficulty } from "~/types/raids"
import { useLocale } from "~/components/app/LocaleManager"
import { useRaidHubManifest } from "~/components/app/RaidHubManifestManager"
import { formattedNumber, secondsToYDHMS } from "~/util/presentation/formatting"

// todo
const versions = [Difficulty.NORMAL, Difficulty.MASTER]

export default function ExpandedStatsTable() {
    const { activities, isLoadingActivities, raid } = useActivitiesContext()
    const { strings, locale } = useLocale()
    const manifest = useRaidHubManifest()
    const versions = Array.from(
        new Set(
            Object.values(manifest?.hashes ?? {})
                .filter(tuple => tuple.raid === raid)
                .map(({ difficulty }) => difficulty)
        )
    ).sort((a, b) => {
        if (a === Difficulty.GUIDEDGAMES) {
            return 1
        } else if (b === Difficulty.GUIDEDGAMES) {
            return -1
        }
        return a - b
    })

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
                header="Total Attempts"
                values={versions.map(v => activities.filter(a => a.difficulty === v).size)}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Total Clears"
                values={versions.map(
                    v =>
                        activities.filter(a => a.difficulty === v && a.player.didMemberComplete)
                            .size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Fresh Clears"
                values={versions.map(
                    v =>
                        activities.filter(
                            a => a.difficulty === v && a.fresh && a.player.didMemberComplete
                        ).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Sherpas"
                values={versions.map(v =>
                    activities
                        .filter(a => a.difficulty === v && a.player.didMemberComplete)
                        .reduce((result, a) => result + a.player.sherpas, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Fresh Sherpas"
                values={versions.map(v =>
                    activities
                        .filter(a => a.difficulty === v && a.fresh && a.player.didMemberComplete)
                        .reduce((result, a) => result + a.player.sherpas, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            {/* TODO <StatsRow header="looted" values={versions.map(v => "123")} /> */}

            <StatsRow
                header="Flawlesses"
                values={versions.map(
                    v => activities.filter(a => a.difficulty === v && a.flawless).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Lowmans"
                values={versions.map(
                    v =>
                        activities.filter(
                            a =>
                                a.difficulty === v &&
                                a.playerCount <= 3 &&
                                a.player.didMemberComplete
                        ).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Trios"
                values={versions.map(
                    v =>
                        activities.filter(
                            a =>
                                a.difficulty === v &&
                                a.playerCount === 3 &&
                                a.player.didMemberComplete
                        ).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Duos"
                values={versions.map(
                    v =>
                        activities.filter(
                            a =>
                                a.difficulty === v &&
                                a.playerCount === 2 &&
                                a.player.didMemberComplete
                        ).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Solos"
                values={versions.map(
                    v =>
                        activities.filter(
                            a =>
                                a.difficulty === v &&
                                a.playerCount === 1 &&
                                a.player.didMemberComplete
                        ).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Kills"
                values={versions.map(v =>
                    activities
                        .filter(a => a.difficulty === v)
                        .reduce((result, a) => result + a.player.kills, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Deaths"
                values={versions.map(v =>
                    activities
                        .filter(a => a.difficulty === v)
                        .reduce((result, a) => result + a.player.deaths, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Assists"
                values={versions.map(v =>
                    activities
                        .filter(a => a.difficulty === v)
                        .reduce((result, a) => result + a.player.assists, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="In Game Time"
                values={versions.map(v =>
                    activities
                        .filter(a => a.difficulty === v)
                        .reduce((result, a) => result + a.player.timePlayedSeconds, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={secondsToYDHMS}
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
    totalsReducer,
    formatter = x => x
}: {
    header: string
    values: T[]
    totalsReducer: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T
    formatter?: (v: T) => ReactNode
}) {
    const totals = values.reduce(totalsReducer)
    return (
        <tbody>
            <tr>
                <th>{header}</th>
                <td>{formatter(totals)}</td>
                {values.map((v, idx) => (
                    <td key={idx}>{formatter(v)}</td>
                ))}
            </tr>
        </tbody>
    )
}
