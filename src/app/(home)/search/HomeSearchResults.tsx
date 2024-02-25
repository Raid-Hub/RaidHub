import type { ReadonlyCollection } from "@discordjs/collection"
import styled from "styled-components"
import { SinglePlayerSearchResult } from "~/components/SinglePlayerSearchResult"
import { Grid } from "~/components/layout/Grid"
import type { RaidHubPlayerSearchResult } from "~/types/raidhub-api"

export const HomeSearchResults = (props: {
    results: ReadonlyCollection<string, RaidHubPlayerSearchResult>
}) => {
    return (
        <Container>
            <Grid $gap={0} $minCardWidth={240}>
                {props.results.map((result, idx) => (
                    <SinglePlayerSearchResult key={idx} player={result} size={2} />
                ))}
            </Grid>
        </Container>
    )
}

const Container = styled.div`
    position: absolute;
    top: 100%;

    min-height: 20em;
    min-width: calc(100% - 2em);
    max-height: calc(100vh - 2em);

    overflow-y: auto;
    overflow-x: hidden;

    margin: 1em;
    padding: 1em;

    background-color: color-mix(in srgb, ${props => props.theme.colors.background.dark}, #0000 5%);
    border-radius: 2px;
    border: 1px solid color-mix(in srgb, ${props => props.theme.colors.border.dark}, #0000 60%);

    backdrop-filter: blur(5px);
`
