import { type UseMutationResult } from "@tanstack/react-query"
import styled from "styled-components"
import { Panel } from "~/components/Panel"
import {
    type RaidHubAdminQueryBody,
    type RaidHubAdminQueryResponse
} from "~/services/raidhub/types"
import { o } from "~/util/o"
import { secondsToHMS } from "~/util/presentation/formatting"
import { SQLTable } from "./table/SQLTable"

export const DataView = ({
    title,
    mutation
}: {
    title: string
    mutation: UseMutationResult<RaidHubAdminQueryResponse, unknown, RaidHubAdminQueryBody>
}) => {
    if (mutation.isLoading) {
        return <div>Loading...</div>
    }
    if (mutation.isError) {
        const err = mutation.error as Error
        return <ErrorMessage>{err.message}</ErrorMessage>
    }
    if (mutation.isSuccess) {
        if (mutation.data.type === "HIGH COST") {
            return (
                <WarningMessage>
                    <div>Warning: High Query Cost</div>Estimated Query duration:{" "}
                    <b>{secondsToHMS(mutation.data.estimatedDuration, false)}</b>
                </WarningMessage>
            )
        }
        if (mutation.data.type === "EXPLAIN") {
            return (
                <Panel>
                    <pre>{mutation.data.data.join("\n")}</pre>
                </Panel>
            )
        } else if (!mutation.data.data.length) {
            return <Panel>{"No rows :("}</Panel>
        } else {
            return (
                <SQLTable
                    title={title}
                    columnLabels={o.keys(mutation.data.data[0])}
                    rows={mutation.data.data}
                />
            )
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
