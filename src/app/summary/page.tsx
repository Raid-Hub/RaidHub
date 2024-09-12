"use client"

import { useCallback, useEffect } from "react"
import { z } from "zod"
import { Flex } from "~/components/layout/Flex"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { PlayerSelectionSearch } from "./PlayerSelectionSearch"
import { SelectedPlayer } from "./SelectedPlayer"
import { SummaryContext } from "./context"
import { DataSummary } from "./data/DataSummary"

export default function Page() {
    const { get, append, getAll, remove, validatedSearchParams } = useQueryParams(
        z.object({
            membershipId: z.string().regex(/^(4611686018\d{9})$/),
            code: z.string().optional()
        })
    )

    useEffect(() => {
        // Parse the code query parameter and add the players to the list
        try {
            const code = get("code")
            if (!code) return

            const values = code.split(",").map(d => parseInt(d, 36))

            const ids = values
                .map((value, index) => "4611686018" + (index === 0 ? value : value + values[0]))
                .map(String)

            remove("membershipId", undefined, {
                commit: false
            })
            ids.forEach(id =>
                append("membershipId", id, {
                    commit: false
                })
            )
            remove("code", undefined, {
                commit: true,
                shallow: true
            })
        } catch (e) {
            console.error(e)
        }
    }, [append, get, remove])

    const addPlayer = useCallback(
        (membershipId: string) => {
            if (!getAll("membershipId").includes(membershipId)) {
                append("membershipId", membershipId, {
                    commit: true,
                    shallow: true
                })
            }
        },
        [append, getAll]
    )

    const generateEncodedCode = useCallback(
        () =>
            getAll("membershipId")
                .map(id => Number(id.substring(10)))
                .map((value, index, vals) => (index === 0 ? value : value - vals[0]))
                .map(d => d.toString(36))
                .join(","),
        [getAll]
    )

    const selectedPlayers = validatedSearchParams.getAll("membershipId")

    return (
        <SummaryContext.Provider value={new Set(selectedPlayers)}>
            <section>
                <PlayerSelectionSearch addPlayer={addPlayer} />
                <div>
                    <h2>Selected Players</h2>
                    <Flex $wrap $align="flex-start">
                        {selectedPlayers.map(membershipId => (
                            <SelectedPlayer
                                key={membershipId}
                                membershipId={membershipId}
                                removePlayer={() =>
                                    remove("membershipId", membershipId, {
                                        commit: true,
                                        shallow: true
                                    })
                                }
                            />
                        ))}
                    </Flex>
                </div>
            </section>
            <DataSummary generateEncodedCode={generateEncodedCode} />
        </SummaryContext.Provider>
    )
}
