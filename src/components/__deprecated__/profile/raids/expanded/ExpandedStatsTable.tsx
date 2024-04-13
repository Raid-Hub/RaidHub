"use client"

import { type ReactNode } from "react"
import { useRaidCardContext } from "~/app/(profile)/raids/RaidCardContext"
import { useLocale } from "~/app/layout/managers/LocaleManager"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { Difficulty } from "~/data/raid"
import type { RaidDifficulty } from "~/services/raidhub/types"
import { formattedNumber, secondsToYDHMS } from "~/util/presentation/formatting"
import styles from "./expanded-raid.module.css"

/**@deprecated */
export default function ExpandedStatsTable() {
    const { activities, isLoadingActivities } = useRaidCardContext()
    const { getDifficultyString } = useRaidHubManifest()
    const { locale } = useLocale()

    // the order of the columns in the chart
    const versions: RaidDifficulty[] = [
        Difficulty.NORMAL,
        Difficulty.PRESTIGE,
        Difficulty.MASTER,
        Difficulty.GUIDEDGAMES
    ]

    if (isLoadingActivities) return <p>loading...</p>

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th />
                    <th>Total</th>
                    {versions.map((v, idx) => (
                        <th key={idx}>{getDifficultyString(v)}</th>
                    ))}
                </tr>
            </thead>
            <StatsRow
                header="Total Attempts"
                values={versions.map(v => activities.filter(a => a.meta.versionId === v).size)}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Total Clears"
                values={versions.map(
                    v => activities.filter(a => a.meta.versionId === v && a.player.completed).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Fresh Clears"
                values={versions.map(
                    v =>
                        activities.filter(
                            a => a.meta.versionId === v && a.fresh && a.player.completed
                        ).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Sherpas"
                values={versions.map(v =>
                    activities
                        .filter(a => a.meta.versionId === v && a.player.completed)
                        .reduce((result, a) => result + a.player.sherpas, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Fresh Sherpas"
                values={versions.map(v =>
                    activities
                        .filter(a => a.meta.versionId === v && a.fresh && a.player.completed)
                        .reduce((result, a) => result + a.player.sherpas, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            {/* TODO <StatsRow header="looted" values={versions.map(v => "123")} /> */}

            <StatsRow
                header="Flawlesses"
                values={versions.map(
                    v => activities.filter(a => a.meta.versionId === v && a.flawless).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Lowmans"
                values={versions.map(
                    v =>
                        activities.filter(
                            a => a.meta.versionId === v && a.playerCount <= 3 && a.player.completed
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
                            a => a.meta.versionId === v && a.playerCount === 3 && a.player.completed
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
                            a => a.meta.versionId === v && a.playerCount === 2 && a.player.completed
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
                            a => a.meta.versionId === v && a.playerCount === 1 && a.player.completed
                        ).size
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            {/* <StatsRow
                header="Kills"
                values={versions.map(v =>
                    activities
                        .filter(a => a.meta.version === v)
                        .reduce((result, a) => result + a.player.kills, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Deaths"
                values={versions.map(v =>
                    activities
                        .filter(a => a.meta.version === v)
                        .reduce((result, a) => result + a.player.deaths, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            />
            <StatsRow
                header="Assists"
                values={versions.map(v =>
                    activities
                        .filter(a => a.meta.version === v)
                        .reduce((result, a) => result + a.player.assists, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={a => formattedNumber(a, locale)}
            /> */}
            <StatsRow
                header="In Game Time"
                values={versions.map(v =>
                    activities
                        .filter(a => a.meta.versionId === v)
                        .reduce((result, a) => result + a.player.timePlayedSeconds, 0 as number)
                )}
                totalsReducer={(prev, curr) => prev + curr}
                formatter={secondsToYDHMS}
            />
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
