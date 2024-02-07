"use client"

import { UseMutationResult } from "@tanstack/react-query"
import { MouseEventHandler } from "react"
import styled from "styled-components"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useRaidHubAdminQuery } from "~/services/raidhub/useRaidHubAdminQuery"
import {
    RaidHubAdminQueryBody,
    RaidHubAdminQueryError,
    RaidHubAdminQueryResponse
} from "~/types/raidhub-api"
import { o } from "~/util/o"
import { secondsToHMS } from "~/util/presentation/formatting"
import { SQLTable } from "./table/SQLTable"

export default function Page() {
    const [queryText, setQueryText] = useLocalStorage("admin-query-text", "SELECT 1")
    const { cancel, ...mutation } = useRaidHubAdminQuery()

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        mutation.mutate({ query: queryText, type: "SELECT" })
    }

    const handleExplainSubmit: MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()

        mutation.mutate({ query: queryText, type: "EXPLAIN" })
    }

    return (
        <PageWrapper>
            <Container onSubmit={e => e.preventDefault()}>
                <CodeTextArea
                    placeholder="Enter SQL query here"
                    rows={10}
                    cols={50}
                    spellCheck="false"
                    value={queryText}
                    onChange={e => setQueryText(e.target.value)}
                />
                <Flex $align="flex-start" $padding={0.25}>
                    <button onClick={handleSubmit} type="submit">
                        Submit
                    </button>
                    <button onClick={handleExplainSubmit} type="submit">
                        Explain
                    </button>
                    <button onClick={mutation.reset} type="reset">
                        Clear Results
                    </button>
                    {mutation.isLoading && (
                        <CancelButton onClick={cancel} type="button">
                            Cancel
                        </CancelButton>
                    )}
                </Flex>
            </Container>
            <DataView {...mutation} />
            {mutation.data?.type === "HIGH COST" && (
                <button
                    onClick={() =>
                        mutation.mutate({
                            query: queryText,
                            type: "SELECT",
                            ignoreCost: true
                        })
                    }>
                    Continue anyways
                </button>
            )}
        </PageWrapper>
    )
}

const DataView = ({
    isLoading,
    isError,
    error,
    isSuccess,
    data
}: UseMutationResult<RaidHubAdminQueryResponse, unknown, RaidHubAdminQueryBody>) => {
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError) {
        const err = error as RaidHubAdminQueryError
        return <ErrorMessage>{err.message}</ErrorMessage>
    }
    if (isSuccess) {
        if (data.type === "HIGH COST") {
            return (
                <WarningMessage>
                    <div>Warning: High Query Cost</div>Expected Query duration:{" "}
                    <b>{secondsToHMS(data.estimatedDuration)}</b>
                </WarningMessage>
            )
        }
        if (data.type === "EXPLAIN") {
            return (
                <div>
                    <pre>{data.data}</pre>
                </div>
            )
        } else if (!data.data.length) {
            return <div>{"No rows :("}</div>
        } else {
            return <SQLTable columnLabels={o.keys(data.data[0])} rows={data.data} />
        }
    }
    return null
}

const ErrorMessage = styled.div`
    color: red;
`

const WarningMessage = styled.div`
    color: yellow;
`

const Container = styled.form`
    width: 100%;
    margin-bottom: 1.5em;
`

const CodeTextArea = styled.textarea`
    width: 100%;
    font-family: "Courier New", monospace;

    font-size: 18px;
    padding: 10px;

    border-radius: 5px;
    resize: vertical;

    background-color: rgb(26, 26, 26);
`

const CancelButton = styled.button`
    background-color: ${({ theme }) => theme.colors.button.destructive};
`
