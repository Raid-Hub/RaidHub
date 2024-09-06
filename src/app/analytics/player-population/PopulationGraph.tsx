import { Collection } from "@discordjs/collection"
import { memo, useCallback, useMemo } from "react"
import styled from "styled-components"
import { useLocale } from "~/app/layout/wrappers/LocaleManager"
import { type RaidHubMetricsPopulationRollingDayResponse } from "~/services/raidhub/types"

const colors: Record<number, string> = {
    4: "yellow",
    7: "green",
    8: "blue",
    9: "teal",
    10: "red",
    11: "orange",
    12: "pink",
    13: "darkgreen",
    14: "darkred"
}
const width = 800
const height = 400
const margin = { top: 20, right: 30, bottom: 30, left: 40 }

export const PopulationGraph = memo(function PopulationGraph({
    data,
    now
}: {
    data: RaidHubMetricsPopulationRollingDayResponse
    now: Date
}) {
    const { locale } = useLocale()
    const valuesByRaid = useMemo(() => {
        const valuesByRaid = new Collection<number, [timestamp: Date, value: number][]>()
        data.forEach(({ population, hour }) => {
            const timestamp = new Date(hour)
            Object.entries(population).forEach(([raid, population]) => {
                const raidId = Number(raid)
                if (!valuesByRaid.has(raidId)) {
                    valuesByRaid.set(raidId, [[timestamp, population]])
                } else {
                    valuesByRaid.get(raidId)!.push([timestamp, population])
                }
            })
        })
        return valuesByRaid
    }, [data])

    // Calculate scales
    const getX = useCallback(
        (timestamp: Date) => {
            const idx = (timestamp.getTime() - now.getTime()) / 3600_000 + 23
            return margin.left + (idx / 23) * (width - margin.left - margin.right)
        },
        [now]
    )

    const maxPopulation = useMemo(
        () => 1.25 * Math.max(...data.flatMap(d => Object.values(d.population))),
        [data]
    )

    const getY = useCallback(
        (population: number) =>
            height -
            margin.bottom -
            (population / maxPopulation) * (height - margin.top - margin.bottom),
        [maxPopulation]
    )

    const pathData = useMemo(
        () => (
            <g>
                {valuesByRaid.map((values, raidId) =>
                    values.length ? (
                        <g key={raidId}>
                            <path
                                fill="none"
                                stroke={colors[raidId] ?? "white"}
                                strokeWidth={1}
                                d={`M${getX(values[0][0])},${getY(
                                    values[0][1] /
                                        Math.min(
                                            (Date.now() - values[0][0].getTime()) / 3600_000,
                                            1
                                        ) **
                                            1.32
                                )} ${values
                                    .slice(1)
                                    .map(
                                        ([timestamp, population]) =>
                                            `L${getX(timestamp)},${getY(population)}`
                                    )
                                    .join(" ")}`}
                            />
                            {values
                                .filter(([t]) => Date.now() - t.getTime() >= 3600_000)
                                .map(([timestamp, value], index) => (
                                    <circle
                                        key={index}
                                        cx={getX(timestamp)}
                                        cy={getY(value)}
                                        r={3}
                                        fill={colors[raidId] ?? "white"}
                                    />
                                ))}
                        </g>
                    ) : null
                )}
            </g>
        ),
        [valuesByRaid, getX, getY]
    )

    const timestampLines = useMemo(
        () => (
            <g>
                {Array.from({ length: 24 }, (_, i) => i).map(i => {
                    const timestamp = new Date(now.getTime() + (i - 23) * 3600_000)
                    const x = getX(timestamp)
                    return (
                        <g key={i}>
                            <line
                                x1={x}
                                y1={margin.top}
                                x2={x}
                                y2={height - margin.bottom}
                                stroke="#d1d1d145"
                                strokeWidth={0.5}
                            />{" "}
                            {i % 2 === 1 && (
                                <text
                                    key={i}
                                    x={x}
                                    y={height - margin.bottom + 15}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="white">
                                    {timestamp.toLocaleTimeString(locale, {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </text>
                            )}
                        </g>
                    )
                })}
            </g>
        ),
        [getX, now, locale]
    )

    const horizontalLines = useMemo(
        () => (
            <g>
                {Array.from({ length: Math.floor(maxPopulation / 100) + 1 }, (_, i) => i).map(i => {
                    const y = getY(i * 100)
                    return (
                        <g key={i}>
                            <line
                                x1={margin.left}
                                y1={y}
                                x2={width - margin.right}
                                y2={y}
                                stroke="#d1d1d125"
                                strokeWidth={0.5}
                            />
                            {i % 2 === 0 && (
                                <text
                                    x={margin.left - 5}
                                    y={y}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill="white">
                                    {i * 100}
                                </text>
                            )}
                        </g>
                    )
                })}
            </g>
        ),
        [getY, maxPopulation]
    )

    return (
        <GraphContainer width={width} height={height}>
            {timestampLines}
            {horizontalLines}
            {pathData}
        </GraphContainer>
    )
})

const GraphContainer = styled.svg`
    border: 1px solid ${({ theme }) => theme.colors.border.medium};
`
