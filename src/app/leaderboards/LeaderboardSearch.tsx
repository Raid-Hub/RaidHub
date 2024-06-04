"use client"

import { type QueryKey } from "@tanstack/react-query"
import { useRef, useState } from "react"
import styled from "styled-components"
import { Panel } from "~/components/Panel"
import { SinglePlayerSearchResult } from "~/components/SinglePlayerSearchResult"
import { SearchInput } from "~/components/form/SearchInput"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { useSearch } from "~/hooks/useSearch"
import { useClickOutside } from "~/hooks/util/useClickOutside"
import { type RaidHubLeaderboardData } from "~/services/raidhub/types"
import { useLeaderboardPlayerSearch } from "./useLeaderboardPlayerSearch"

export const LeaderboardSearch = (args: {
    queryKeyWithoutPage: QueryKey
    mutationFn: (membershipId: string) => Promise<RaidHubLeaderboardData>
}) => {
    const [isShowingResults, setIsShowingResults] = useState(false)
    const ref = useRef<HTMLFormElement>(null)
    const { enteredText, results, handleFormSubmit, handleInputChange, clearQuery } = useSearch()

    const { mutate: search, reset } = useLeaderboardPlayerSearch(args)

    useClickOutside(ref, () => setIsShowingResults(false), {
        lockout: 100,
        enabled: isShowingResults
    })

    return (
        <Flex
            as="form"
            ref={ref}
            $padding={0}
            onSubmit={handleFormSubmit}
            onClick={() => setIsShowingResults(true)}
            style={{ flex: 1 }}>
            <SearchInput
                value={enteredText}
                onChange={handleInputChange}
                placeholder="Search the Leaderboard"
                $size={5}
            />
            {isShowingResults && !!results.size && (
                <Results>
                    <Panel $fullWidth>
                        <Grid $gap={0} $minCardWidth={180}>
                            {results.map((result, idx) => (
                                <SinglePlayerSearchResult
                                    key={idx}
                                    noLink
                                    handleSelect={() => {
                                        reset()
                                        search(result.membershipId)
                                        clearQuery()
                                    }}
                                    player={result}
                                    size={1.5}
                                />
                            ))}
                        </Grid>
                    </Panel>
                </Results>
            )}
        </Flex>
    )
}

const Results = styled.div`
    position: absolute;
    top: 115%;
    left: 0;
    right: 0;
    z-index: 1;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5x);
`
