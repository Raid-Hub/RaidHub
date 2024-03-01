"use client"

import Link from "next/link"
import styled from "styled-components"
import { type LeaderboardEntry } from "~/app/leaderboards/LeaderboardEntries"
import { OptionalWrapper } from "~/components/OptionalWrapper"
import { Panel } from "~/components/Panel"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { MobileDesktopSwitch } from "~/components/util/MobileDesktopSwitch"
import { useLocale } from "~/layout/managers/LocaleManager"
import { formattedNumber, secondsToHMS, truncatedNumber } from "../../util/presentation/formatting"
import { LeaderboardEntryTeamPlayer } from "./LeaderboardEntryTeamPlayer"

export const LeaderboardEntryComponent = ({
    format,
    placementIcon,
    ...entry
}: LeaderboardEntry & {
    placementIcon?: JSX.Element
    format: "time" | "number"
}) => {
    const { locale } = useLocale()
    const value =
        format === "time" ? secondsToHMS(entry.value, true) : formattedNumber(entry.value, locale)

    return (
        <MobileDesktopSwitch
            sm={<></>}
            lg={
                <Panel $maxWidth={900}>
                    <Flex $gap={2.5}>
                        <Container style={{ fontSize: "1.375rem", minWidth: "20px" }}>
                            {placementIcon ?? truncatedNumber(entry.rank)}
                        </Container>

                        {entry.type === "team" ? (
                            <Grid $minCardWidth={180} $fullWidth>
                                {entry.team.map(player => (
                                    <LeaderboardEntryTeamPlayer key={player.id} {...player} />
                                ))}
                            </Grid>
                        ) : (
                            <>{"todo"}</>
                        )}
                        <OptionalWrapper
                            condition={entry.url}
                            wrapper={({ children, value }) => (
                                <Link
                                    style={{ color: "unset" }}
                                    href={value}
                                    target={value.startsWith("/") ? "" : "_blank"}>
                                    {children}
                                </Link>
                            )}>
                            <Value>{value}</Value>
                        </OptionalWrapper>
                    </Flex>
                </Panel>
            }
        />
    )
}

const Value = styled.span`
    white-space: nowrap;
    font-size: 1.375rem;
    color: ${({ theme }) => theme.colors.text.secondary};
`
