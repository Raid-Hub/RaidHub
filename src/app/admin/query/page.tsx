"use client"

import { type UseMutationResult } from "@tanstack/react-query"
import { type MouseEventHandler } from "react"
import styled from "styled-components"
import { Panel } from "~/components/Panel"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useRaidHubAdminQuery } from "~/services/raidhub/hooks"
import type {
    RaidHubAdminQueryBody,
    RaidHubAdminQueryError,
    RaidHubAdminQueryResponse
} from "~/services/raidhub/types"
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

    const submitBtnsDisabled =
        mutation.data?.type === "HIGH COST" || (!mutation.isIdle && !mutation.isSuccess)

    return (
        <PageWrapper>
            <Container onSubmit={e => e.preventDefault()}>
                <CodeTextArea
                    placeholder="Enter SQL query here"
                    rows={10}
                    cols={50}
                    spellCheck={false}
                    value={queryText}
                    onChange={e => setQueryText(e.target.value)}
                />
                <Flex $align="flex-start" $padding={0.25}>
                    <button onClick={handleSubmit} type="submit" disabled={submitBtnsDisabled}>
                        Submit
                    </button>
                    <button
                        onClick={handleExplainSubmit}
                        type="submit"
                        disabled={submitBtnsDisabled}>
                        Explain
                    </button>
                    <button
                        onClick={mutation.reset}
                        type="reset"
                        disabled={!mutation.data || mutation.data.type === "HIGH COST"}>
                        Clear Results
                    </button>
                    {mutation.isLoading && <CancelButton onClick={cancel}>Cancel</CancelButton>}
                </Flex>
            </Container>
            <DataView {...mutation} />
            {mutation.data?.type === "HIGH COST" && (
                <Flex $align="flex-start">
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
                    <CancelButton onClick={() => mutation.reset()}>Cancel</CancelButton>
                </Flex>
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
                    <div>Warning: High Query Cost</div>Estimated Query duration:{" "}
                    <b>{secondsToHMS(data.estimatedDuration, false)}</b>
                </WarningMessage>
            )
        }
        if (data.type === "EXPLAIN") {
            return (
                <Panel>
                    <pre>{data.data.join("\n")}</pre>
                </Panel>
            )
        } else if (!data.data.length) {
            return <Panel>{"No rows :("}</Panel>
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

const CancelButton = styled.button.attrs({ type: "button" })`
    background-color: ${({ theme }) => theme.colors.button.destructive};
`
