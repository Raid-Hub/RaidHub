import {
    RaidHubAPIResponse,
    RaidHubActivitySearchResponse,
    RaidHubActivitySearchResult
} from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "./createHeaders"
import { z } from "zod"
import { booleanString, numberString } from "~/util/zod"
import { ListedRaid, ListedRaids } from "~/types/raids"
import { includedIn } from "~/util/betterIncludes"

export function activitySearchQueryKey() {
    return ["raidhub-activity-search"] as const
}

// we have the bungie queries as backups
export async function activitySearch(queryString: string): Promise<RaidHubActivitySearchResult[]> {
    const url = new URL(getRaidHubBaseUrl() + `/activities/search?` + queryString)
    url.searchParams.append("membershipId", "4611686018488107374")
    url.searchParams.append("membershipId", "4611686018494548988")

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<RaidHubActivitySearchResponse>
    if (data.success) {
        return data.response.results
    } else {
        throw new Error(data.message)
    }
}

export const activitySearchQuerySchema = z
    .object({
        membershipId: z
            .union([z.array(numberString).min(1), numberString.transform(s => [s])])
            .optional(),
        minPlayers: z.coerce.number().int().nonnegative().optional(),
        maxPlayers: z.coerce.number().int().nonnegative().optional(),
        minDate: z.coerce.date().optional(),
        maxDate: z.coerce.date().optional(),
        minSeason: z.coerce.number().int().nonnegative().optional(),
        maxSeason: z.coerce.number().int().nonnegative().optional(),
        fresh: booleanString.optional(),
        completed: booleanString.optional(),
        flawless: booleanString.optional(),
        raid: z.coerce
            .number()
            .int()
            .positive()
            .refine(n => includedIn(ListedRaids, n), {
                message: "invalid raid value"
            })
            .optional(),
        platformType: z.coerce.number().int().positive().optional(),
        reversed: z.coerce.boolean().default(false),
        count: z.coerce.number().int().positive().default(25),
        page: z.coerce.number().int().positive().default(1)
    })
    .strict()
    .transform(({ membershipId, raid, ...q }) => ({
        membershipIds: membershipId,
        raid: raid as ListedRaid | undefined,
        ...q
    }))
