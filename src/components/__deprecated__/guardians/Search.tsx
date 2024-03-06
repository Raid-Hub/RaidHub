"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Panel } from "~/components/Panel"
import { usePortal } from "~/components/Portal"
import { SinglePlayerSearchResult } from "~/components/SinglePlayerSearchResult"
import { Grid } from "~/components/layout/Grid"
import { useSearch } from "~/hooks/useSearch"
import { useEventListener } from "~/hooks/util/useEventListener"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import styles from "./guardians.module.css"

export default function Search() {
    const ref = useRef<HTMLDivElement>(null)
    const { enteredText, results, handleFormSubmit, handleInputChange } = useSearch()
    const [isShowingResults, setIsShowingResults] = useState(false)
    const params = useQueryParams<{
        membershipId: string
    }>()

    // control the hiding of the search bar
    const handleClickFn = useCallback(
        (e: MouseEvent) => {
            if (isShowingResults) {
                if (!ref.current?.parentNode?.contains(e.target as Node)) {
                    setIsShowingResults(false)
                }
            } else {
                if (ref.current?.contains(e.target as Node)) {
                    setIsShowingResults(true)
                }
            }
        },
        [isShowingResults]
    )
    useEventListener("click", handleClickFn)

    useEffect(() => setIsShowingResults(true), [enteredText])

    const portal = usePortal()

    return (
        <div className={styles.search} ref={ref}>
            <form onSubmit={handleFormSubmit}>
                <input
                    autoFocus
                    type="text"
                    name="search"
                    autoComplete="off"
                    placeholder={"Search for a Guardian"}
                    value={enteredText}
                    onChange={handleInputChange}
                />
            </form>
            {isShowingResults &&
                !!results.size &&
                portal(
                    <Panel $fullWidth $backropBlur style={{ position: "absolute", zIndex: 5 }}>
                        <Grid $gap={0.25}>
                            {results.map(player => (
                                <SinglePlayerSearchResult
                                    key={player.membershipId}
                                    player={player}
                                    size={1}
                                    noLink
                                    handleSelect={() => {
                                        setIsShowingResults(false)
                                        params.append("membershipId", player.membershipId)
                                    }}
                                />
                            ))}
                        </Grid>
                    </Panel>
                )}
        </div>
    )
}
