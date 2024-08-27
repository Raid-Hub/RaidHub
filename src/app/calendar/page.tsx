"use client"

import { Collection } from "@discordjs/collection"
import Link from "next/link"
import { useMemo } from "react"
import styled from "styled-components"
import { Grid } from "~/components/layout/Grid"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { useSeasons } from "~/hooks/dexie"
import { usePublicMilestones } from "~/services/bungie/hooks"
import { modulo } from "~/util/math"
import { useRaidHubManifest } from "../layout/wrappers/RaidHubManifestManager"
import { FeaturedRaidRotatorEntry, RaidRotatorEntry } from "./RaidRotatorEntry"

export default function Page() {
    const seasons = useSeasons()
    const { listedRaids, getDefinitionFromHash, milestoneHashes } = useRaidHubManifest()
    const {
        data: milestones,
        isLoading,
        isError,
        error
    } = usePublicMilestones({
        select: milestones =>
            new Collection(Object.entries(milestones)).filter((_, hash) => {
                const definition = milestoneHashes.get(Number(hash))
                return definition && definition.id !== listedRaids[0]
            }),
        refetchInterval: milestones => {
            if (!milestones) return false
            const now = Date.now()
            const nextReset = milestones.first()?.endDate
            if (!nextReset) return false
            // Refetch 2 minutes after the next reset
            return new Date(nextReset).getTime() - now + 2 * 60 * 1000
        }
    })

    const thisWeek = useMemo(
        () =>
            milestones?.find(milestone =>
                milestone.activities.some(
                    a =>
                        // Apparently the raid milestone is the only one with challengeObjectiveHashes
                        a.challengeObjectiveHashes.length
                )
            ) ?? null,
        [milestones]
    )

    const thisWeeksRaid = useMemo(() => {
        if (!thisWeek) return null
        return getDefinitionFromHash(thisWeek.activities[0].activityHash)?.activity.id ?? null
    }, [thisWeek, getDefinitionFromHash])

    const orderedMilestones = useMemo(() => {
        if (!milestones || !thisWeeksRaid) return []
        return Array.from(
            milestones
                .toSorted((a, b) => {
                    const aHash = getDefinitionFromHash(a.activities[0].activityHash)?.activity.id
                    const bHash = getDefinitionFromHash(b.activities[0].activityHash)?.activity.id
                    if (!aHash || !bHash) return +!!aHash ^ +!!bHash ? (aHash ? 1 : -1) : 0
                    return modulo(aHash - thisWeeksRaid, 64) - modulo(bHash - thisWeeksRaid, 64)
                })
                .values()
        )
    }, [milestones, thisWeeksRaid, getDefinitionFromHash])

    const seasonEnd = useMemo(
        () =>
            seasons?.length
                ? seasons.findLast(season => new Date(season.startDate!) < new Date())?.endDate ??
                  null
                : null,
        [seasons]
    )

    if (isError) {
        return (
            <PageWrapper>
                <ErrorComponent>{(error as Error).message}</ErrorComponent>
            </PageWrapper>
        )
    }
    if (isLoading) {
        return (
            <PageWrapper>
                <MessageComponent>Loading Weekly Milestones...</MessageComponent>
            </PageWrapper>
        )
    }
    if (!seasonEnd) {
        return (
            <PageWrapper>
                <MessageComponent>Loading Seasons...</MessageComponent>
            </PageWrapper>
        )
    }

    const seasonEndDate = new Date(seasonEnd)

    if (!thisWeek || seasonEndDate.getTime() <= Date.now()) {
        return (
            <PageWrapper>
                <MessageComponent>
                    No featured raid this week. If this doesn&apos;t seem right, please file a bug
                    report in <Link href="https://discord.gg/raidhub">discord.gg/raidhub</Link>
                </MessageComponent>
            </PageWrapper>
        )
    }

    const weeks = Array.from(
        { length: Math.ceil((seasonEndDate.getTime() - Date.now()) / 604800000) },
        (_, idx) => {
            const milestoneStartDate = new Date(thisWeek.startDate!)
            milestoneStartDate.setDate(milestoneStartDate.getDate() + idx * 7)

            const milestoneEndDate = new Date(thisWeek.endDate!)
            milestoneEndDate.setDate(milestoneEndDate.getDate() + idx * 7)

            return {
                milestone: orderedMilestones[idx % orderedMilestones.length],
                startDate: milestoneStartDate,
                endDate: milestoneEndDate
            }
        }
    )

    return (
        <PageWrapper>
            <Grid $minCardWidth={999}>
                <FeaturedRaidRotatorEntry {...weeks[0]} />
                {weeks.splice(1).map(({ milestone, startDate, endDate }, idx) => (
                    <RaidRotatorEntry
                        key={idx}
                        milestone={milestone}
                        startDate={startDate}
                        endDate={endDate}
                    />
                ))}
            </Grid>
        </PageWrapper>
    )
}

const MessageComponent = styled.div`
    font-size: 1.5rem;
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 60%);
    padding: 1em;
    border-radius: 1em;
`

const ErrorComponent = styled.div`
    color: red;
`
