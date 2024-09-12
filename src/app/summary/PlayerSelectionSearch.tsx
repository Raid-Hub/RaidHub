import { useRef, useState } from "react"
import styled from "styled-components"
import { Panel } from "~/components/Panel"
import { SinglePlayerSearchResult } from "~/components/SinglePlayerSearchResult"
import { SearchInput } from "~/components/form/SearchInput"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { useSearch } from "~/hooks/useSearch"
import { useClickOutside } from "~/hooks/util/useClickOutside"

export const PlayerSelectionSearch = ({
    addPlayer
}: {
    addPlayer: (membershipId: string) => void
}) => {
    const [isShowingResults, setIsShowingResults] = useState(false)
    const { enteredText, results, handleFormSubmit, handleInputChange, clearQuery } = useSearch()

    const ref = useRef<HTMLFormElement>(null)

    useClickOutside(ref, () => setIsShowingResults(false), {
        lockout: 100,
        enabled: isShowingResults
    })

    return (
        <Container>
            <Flex
                as="form"
                ref={ref}
                $padding={0}
                onSubmit={handleFormSubmit}
                onClick={() => setIsShowingResults(true)}
                style={{ flex: 1 }}>
                <SearchInput
                    value={enteredText}
                    onChange={e => {
                        setIsShowingResults(true)
                        handleInputChange(e)
                    }}
                    placeholder="Find a player"
                    $size={5}
                />
                {isShowingResults && !!results.size && (
                    <Results>
                        <Panel $fullWidth $padding={0}>
                            <Grid $gap={0} $minCardWidth={180}>
                                {results.map((result, idx) => (
                                    <SinglePlayerSearchResult
                                        key={idx}
                                        noLink
                                        handleSelect={() => {
                                            addPlayer(result.membershipId)
                                            clearQuery()
                                        }}
                                        player={result}
                                        size={1.25}
                                    />
                                ))}
                            </Grid>
                        </Panel>
                    </Results>
                )}
            </Flex>
        </Container>
    )
}

const Results = styled.div`
    position: absolute;
    top: 115%;
    left: 0;
    right: 0;
    z-index: 1;
    backdrop-filter: blur(5px);
`
