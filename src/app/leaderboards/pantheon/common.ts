import { notFound } from "next/navigation"
import { getRaidHubApi } from "~/services/raidhub/common"
import {
    type PantheonId,
    type RaidHubIndividualLeaderboardCategory,
    type RaidHubManifest,
    type RaidHubPantheonPath
} from "~/services/raidhub/types"

export const ENTRIES_PER_PAGE = 25

export type PantheonVersionLeaderboardStaticParams = {
    params: {
        version: RaidHubPantheonPath
    }
    searchParams: Record<string, string>
}

export const getPantheonVersion = (path: RaidHubPantheonPath, manifest: RaidHubManifest) => {
    const versionStr = Object.entries(manifest.pantheonUrlPaths).find(([, p]) => p === path)?.[0]
    if (!versionStr) {
        return notFound()
    } else {
        return Number(versionStr) as PantheonId
    }
}

export const createTeamQueryKey = (args: {
    category: "first" | "speedrun"
    pantheonPath: RaidHubPantheonPath
    page: number
    count: number
}) => {
    return ["pantheon", args.pantheonPath, args.category, args.count, args.page] as const
}

export const getTeamLeaderboard = async (props: {
    category: "first" | "speedrun"
    version: RaidHubPantheonPath
    page: number
    count: number
}) =>
    getRaidHubApi(
        `/leaderboard/pantheon/{version}/${props.category}`,
        {
            version: props.version
        },
        {
            page: props.page,
            count: props.count
        }
    )

export const createIndividualQueryKey = (args: {
    category: RaidHubIndividualLeaderboardCategory
    page: number
    count: number
}) => {
    return ["pantheon", "all", args.category, args.count, args.page] as const
}

export const getIndividualLeaderboard = async (props: {
    category: RaidHubIndividualLeaderboardCategory
    page: number
    count: number
}) =>
    getRaidHubApi(
        `/leaderboard/pantheon/all/{category}`,
        {
            category: props.category
        },
        {
            page: props.page,
            count: props.count
        }
    )
