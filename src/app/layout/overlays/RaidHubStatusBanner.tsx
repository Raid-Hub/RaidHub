"use client"

import Link from "next/link"
import { useMemo } from "react"
import styled from "styled-components"
import { Container } from "~/components/layout/Container"
import { useRaidHubStatus } from "~/services/raidhub/useRaidHubStatus"
import { formattedTimeSince, secondsToString } from "~/util/presentation/formatting"
import { useLocale } from "../wrappers/LocaleManager"

type AtlasState =
    | {
          status: "loading"
      }
    | {
          status: "ok"
          lagSeconds: number
      }
    | {
          status: "paused"
          lastCrawledDate: Date
      }
    | {
          status: "warn"
          lagSeconds: number
          lastCrawledDate: Date
          estimatedCatchupDate: Date | null
      }
    | {
          status: "alert"
          lastCrawledDate: Date
          reason: string
      }
    | {
          status: "error"
          reason: string
      }

export const RaidHubStatusBanner = () => {
    const statusQuery = useRaidHubStatus()

    const atlasStatus = useMemo((): AtlasState => {
        if (statusQuery.isLoading) return { status: "loading" }
        if (statusQuery.isError) return { status: "error", reason: statusQuery.error.message }

        const atlas = statusQuery.data.AtlasPGCR

        switch (atlas.status) {
            case "Crawling":
                if (!atlas.medianSecondsBehindNow) {
                    return {
                        status: "error",
                        reason: "Invalid API response"
                    }
                } else if (atlas.medianSecondsBehindNow < 60) {
                    return {
                        status: "ok",
                        lagSeconds: atlas.medianSecondsBehindNow
                    }
                } else {
                    return {
                        status: "warn",
                        lagSeconds: atlas.medianSecondsBehindNow,
                        lastCrawledDate: new Date(atlas.latestActivity.dateCompleted),
                        estimatedCatchupDate: atlas.estimatedCatchUpTimestamp
                            ? new Date(atlas.estimatedCatchUpTimestamp)
                            : null
                    }
                }
            case "Idle":
                return {
                    status: "paused",
                    lastCrawledDate: new Date(atlas.latestActivity.dateCompleted)
                }
            case "Offline":
                return {
                    status: "alert",
                    lastCrawledDate: new Date(atlas.latestActivity.dateCompleted),
                    reason: "Crawler Offline"
                }
            default:
                return {
                    status: "error",
                    reason: "Unknown Atlas state"
                }
        }
    }, [statusQuery])

    return (
        <Container $fullWidth>
            <RaidHubStatsBannerInner state={atlasStatus} />
        </Container>
    )
}

const RaidHubStatsBannerInner = ({ state }: { state: AtlasState }) => {
    const { locale } = useLocale()
    switch (state.status) {
        case "ok":
        case "loading":
            return null
        case "paused":
            return (
                <StyledRaidHubStatsBanner $alertLevel="warn">
                    {`RaidHub activity crawling is currently paused. Latest activity crawled at: `}
                    <b>
                        {state.lastCrawledDate.toLocaleString(locale, {
                            timeZoneName: "short"
                        })}
                    </b>
                </StyledRaidHubStatsBanner>
            )
        case "warn":
            return (
                <StyledRaidHubStatsBanner $alertLevel="warn">
                    {`Warning: RaidHub activity crawling has fallen behind. Activites are currently delayed by `}
                    <b>{secondsToString(state.lagSeconds)}</b>
                    {`. `}
                    {state.estimatedCatchupDate &&
                        state.estimatedCatchupDate.getTime() > Date.now() && (
                            <>
                                {`We expect this issue to be resolved by `}
                                <b>
                                    {state.estimatedCatchupDate.toLocaleTimeString(locale, {
                                        timeZoneName: "short",
                                        hour: "numeric",
                                        minute: "numeric"
                                    })}
                                </b>
                                {` (${formattedTimeSince(state.estimatedCatchupDate)}).`}
                            </>
                        )}

                    {`We apologize for the inconvenience.`}
                </StyledRaidHubStatsBanner>
            )
        case "alert":
            return (
                <StyledRaidHubStatsBanner $alertLevel="alert">
                    {`Alert: No new activities are currently being added (${state.reason}). Latest activity crawled at: `}
                    <b>
                        {state.lastCrawledDate.toLocaleString(locale, {
                            timeZoneName: "short"
                        })}
                    </b>
                    {`. We apologize for the inconvenience and are working to resolve the issue.`}
                </StyledRaidHubStatsBanner>
            )
        case "error":
            return (
                <StyledRaidHubStatsBanner $alertLevel="error">
                    {`An error occurred while checking RaidHub's status: ${state.reason}. Activity crawling may be paused. Please let us know in our `}
                    <Link
                        href="https://discord.gg/raidhub"
                        style={{
                            color: "unset",
                            textDecoration: "underline"
                        }}>
                        Discord server
                    </Link>
                    {` if you continue to experience issues.`}
                </StyledRaidHubStatsBanner>
            )
    }
}

const StyledRaidHubStatsBanner = styled.div<{
    $alertLevel: "info" | "warn" | "alert" | "error"
}>`
    background-color: ${props => {
        switch (props.$alertLevel) {
            case "info":
                return props.theme.colors.background.info
            case "warn":
                return props.theme.colors.background.warning
            case "alert":
                return props.theme.colors.background.error
            case "error":
                return props.theme.colors.background.error
        }
    }};
    letter-spacing: 0.2px;
    color: ${props => (props.$alertLevel === "warn" ? "black" : props.theme.colors.text.white)};
    padding: 0.5rem;
`
