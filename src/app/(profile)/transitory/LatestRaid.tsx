"use client"

import Link from "next/link"
import { useMemo } from "react"
import styled from "styled-components"
import { useLocale } from "~/app/layout/managers/LocaleManager"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { Card } from "~/components/Card"
import { CloudflareImage } from "~/components/CloudflareImage"
import Checkmark from "~/components/icons/Checkmark"
import Xmark from "~/components/icons/Xmark"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { usePageProps } from "~/components/layout/PageWrapper"
import { H4 } from "~/components/typography/H4"
import RaidBanners from "~/data/raid-banners"
import { useRaidHubActivity, useRaidHubActivtiesFirstPage } from "~/services/raidhub/hooks"
import { getBungieDisplayName } from "~/util/destiny/getBungieDisplayName"
import { formattedTimeSince, secondsToHMS } from "~/util/presentation/formatting"
import type { ProfileProps } from "../types"
import { Latest } from "./Latest"

export const LatestRaid = () => {
    const { destinyMembershipId } = usePageProps<ProfileProps>()
    const { locale } = useLocale()
    const { getRaidFromHash } = useRaidHubManifest()
    const { data: rawRecentActivity } = useRaidHubActivtiesFirstPage(destinyMembershipId, {
        select: res => res.activities[0],
        suspense: true
    })

    const { data: latestActivity } = useRaidHubActivity(rawRecentActivity?.instanceId ?? "", {
        enabled: !!rawRecentActivity,
        suspense: true
    })

    const { playersToDisplay, hiddenPlayers } = useMemo(() => {
        if (!latestActivity) return { playersToDisplay: null, hiddenPlayers: 0 }
        if (latestActivity.playerCount <= 12) {
            return { playersToDisplay: latestActivity.players, hiddenPlayers: 0 }
        } else {
            return {
                playersToDisplay: latestActivity.players.slice(0, 6),
                hiddenPlayers: latestActivity.playerCount - 6
            }
        }
    }, [latestActivity])

    return latestActivity ? (
        <Latest $playerCount={latestActivity.playerCount ?? 6}>
            <Link
                href={`/pgcr/${latestActivity.instanceId}`}
                style={{
                    color: "unset"
                }}>
                <Card $overflowHidden $fullHeight>
                    <Container $minHeight={80}>
                        <CloudflareImage
                            cloudflareId={RaidBanners[latestActivity.meta.activityId]}
                            fill
                            priority
                            alt="raid background image"
                            style={{ objectFit: "cover" }}
                        />
                    </Container>
                    <Flex $direction="column" $crossAxis="flex-start">
                        <H4 $mBlock={0.25}>
                            <Flex $padding={0} $wrap>
                                {"Latest Raid"}
                                <svg width={8} height={8}>
                                    <circle r={3} fill="gray" cx="50%" cy="50%" />
                                </svg>
                                {formattedTimeSince(new Date(latestActivity.dateCompleted), locale)}
                            </Flex>
                        </H4>
                        <Flex $padding={0} $wrap $gap={0.4} $align="flex-start">
                            {latestActivity.players.find(
                                p => p.player.membershipId === destinyMembershipId
                            )?.data.completed ? (
                                <Checkmark sx={24} />
                            ) : (
                                <Xmark sx={24} />
                            )}
                            <RaidName>
                                {latestActivity.meta.activityName}
                                {": "}
                                {latestActivity.meta.versionName}
                            </RaidName>

                            <Duration>{secondsToHMS(latestActivity.duration, false)}</Duration>
                        </Flex>
                        <Flex $wrap $padding={0} $align="flex-start">
                            {playersToDisplay?.map(player => (
                                <Flex key={player.player.membershipId} $padding={0} $gap={0.4}>
                                    {player.data.completed ? (
                                        <Checkmark sx={18} />
                                    ) : (
                                        <Xmark sx={18} />
                                    )}
                                    <Player $finished={player.data.completed}>
                                        {getBungieDisplayName(player.player)}
                                    </Player>
                                </Flex>
                            ))}
                        </Flex>
                        {!!hiddenPlayers && (
                            <HiddenPlayers>and {hiddenPlayers} more...</HiddenPlayers>
                        )}
                    </Flex>
                </Card>
            </Link>
        </Latest>
    ) : null
}

const RaidName = styled.span`
    font-size: 1.25rem;
`

const Duration = styled.span`
    color: ${p => p.theme.colors.text.secondary};
    font-style: italic;
    padding-left: 0.5rem;
`

const Player = styled.span<{
    $finished?: boolean
}>`
    font-size: 1rem;
    color: ${p => p.theme.colors.text[p.$finished ? "secondary" : "tertiary"]};
`

const HiddenPlayers = styled.div`
    color: ${p => p.theme.colors.text.secondary};
`
