"use client"

import { Collection } from "@discordjs/collection"
import { useMemo } from "react"
import { Grid } from "~/components/layout/Grid"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { RaidMileStones } from "~/data/milestones"
import { WeeklyFeaturedRaidChallengeObjectiveHash } from "~/data/weekly-featured-raid"
import { useSeasons } from "~/hooks/dexie/useSeasonDefinition"
import { usePublicMilestones } from "~/services/bungie/usePublicMilestones"
import { modulo } from "~/util/math"
import { useRaidHubManifest } from "../managers/RaidHubManifestManager"
import { FeaturedRaidRotatorEntry, RaidRotatorEntry } from "./RaidRotatorEntry"

const raidMilestoneHashes = Object.values(RaidMileStones)

export default function Page() {
    const { getRaidFromHash } = useRaidHubManifest()
    const { data: milestones, isLoading } = usePublicMilestones({
        select: milestones =>
            new Collection(Object.entries(milestones)).filter((_, hash) =>
                raidMilestoneHashes.includes(Number(hash))
            )
    })

    const thisWeek = useMemo(
        () =>
            milestones?.find(milestone =>
                milestone.activities[0].challengeObjectiveHashes.includes(
                    WeeklyFeaturedRaidChallengeObjectiveHash
                )
            ),
        [milestones]
    )

    const thisWeeksRaid = useMemo(() => {
        if (!thisWeek) return null
        const a = getRaidFromHash(thisWeek.activities[0].activityHash)
        return a?.raid ?? null
    }, [getRaidFromHash, thisWeek])

    const orderedMilestones = useMemo(() => {
        if (!milestones || !thisWeeksRaid) return []
        return Array.from(
            milestones
                .toSorted((a, b) => {
                    const aHash = getRaidFromHash(a.activities[0].activityHash)?.raid
                    const bHash = getRaidFromHash(b.activities[0].activityHash)?.raid
                    if (!aHash || !bHash) return +!!aHash ^ +!!bHash ? (aHash ? 1 : -1) : 0
                    return modulo(aHash - thisWeeksRaid, 100) - modulo(bHash - thisWeeksRaid, 100)
                })
                .values()
        )
    }, [milestones, thisWeeksRaid, getRaidFromHash])

    const seasons = useSeasons()

    const seasonEndDate = useMemo(
        () =>
            new Date(
                seasons.findLast(season => new Date(season.startDate!).getTime() < Date.now())
                    ?.endDate ?? Date.now()
            ),
        [seasons]
    )

    if (isLoading) {
        return <PageWrapper>Loading Milestone...</PageWrapper>
    }
    if (!thisWeek) {
        return <PageWrapper>No featured raid this week</PageWrapper>
    }

    if (!seasonEndDate) {
        return <PageWrapper>Season not found</PageWrapper>
    }

    if (seasonEndDate.getTime() <= Date.now()) {
        return <PageWrapper>Loading Season...</PageWrapper>
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
