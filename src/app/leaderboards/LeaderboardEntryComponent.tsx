"use client"

import Link from "next/link"
import styled from "styled-components"
import { OptionalWrapper } from "~/components/OptionalWrapper"
import { Panel } from "~/components/Panel"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { Grid } from "~/components/layout/Grid"
import { usePageProps } from "~/components/layout/PageWrapper"
import { MobileDesktopSwitch } from "~/components/util/MobileDesktopSwitch"
import { useLocale } from "~/layout/managers/LocaleManager"
import { $media } from "~/layout/media"
import { formattedNumber, secondsToHMS, truncatedNumber } from "../../util/presentation/formatting"
import { type LeaderboardEntry } from "./LeaderboardEntries"
import { LeaderboardEntryPlayerComponent } from "./LeaderboardEntryPlayer"

export const LeaderboardEntryComponent = ({
    placementIcon,
    ...entry
}: LeaderboardEntry & {
    placementIcon?: JSX.Element
}) => {
    const { format } = usePageProps<{ format: "time" | "number" }>()
    const { locale } = useLocale()
    const value =
        format === "time" ? secondsToHMS(entry.value, true) : formattedNumber(entry.value, locale)

    return (
        <MobileDesktopSwitch
            sm={
                <Panel $fullWidth>
                    <Flex $gap={2} $padding={0.5}>
                        <Container $flex style={{ fontSize: "1.375rem", minWidth: "20px" }}>
                            {placementIcon ?? truncatedNumber(entry.rank)}
                        </Container>
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
                    <Flex $padding={0.5}>
                        {entry.type === "player" ? (
                            <LeaderboardEntryPlayerComponent {...entry.player} />
                        ) : (
                            <Grid $numCols={1} $fullWidth>
                                {entry.team.map(player => (
                                    <LeaderboardEntryPlayerComponent key={player.id} {...player} />
                                ))}
                            </Grid>
                        )}
                    </Flex>
                </Panel>
            }
            lg={
                <Panel $maxWidth={entry.type === "team" ? 900 : 450} $fullWidth $growOnHover>
                    <Flex $align={"space-between"}>
                        <Flex style={{ flex: 1 }} $padding={0} $align="flex-start">
                            <Container
                                $flex
                                $aspectRatio={{
                                    width: 1,
                                    height: 1
                                }}
                                style={{
                                    fontSize: "1.375rem",
                                    minWidth: "10%"
                                }}>
                                {placementIcon ?? truncatedNumber(entry.rank)}
                            </Container>
                            {entry.type === "team" ? (
                                <Grid $minCardWidth={180} $fullWidth>
                                    {entry.team.map(player => (
                                        <LeaderboardEntryPlayerComponent
                                            key={player.id}
                                            {...player}
                                        />
                                    ))}
                                </Grid>
                            ) : (
                                <LeaderboardEntryPlayerComponent {...entry.player} />
                            )}
                        </Flex>
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
    ${$media.max.mobile`
        font-size: 1.125rem;
    `}
    color: ${({ theme }) => theme.colors.text.secondary};
`
