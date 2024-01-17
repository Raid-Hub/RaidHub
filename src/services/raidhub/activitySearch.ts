import { RaidHubAPIResponse, RaidHubActivitySearchResponse } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "./createHeaders"
import { z } from "zod"
import { booleanString, numberString } from "~/util/zod"
import { ListedRaid, ListedRaids } from "~/types/raids"
import { includedIn } from "~/util/betterIncludes"
import Activity from "~/models/profile/data/Activity"
import { Collection } from "@discordjs/collection"

export function activitySearchQueryKey(query: z.infer<typeof activitySearchQuerySchema>) {
    return ["raidhub-activity-search", query] as const
}

// we have the bungie queries as backups
export async function activitySearch(queryString: string): Promise<Collection<string, Activity>> {
    const url = new URL(getRaidHubBaseUrl() + `/activity/search?` + queryString)

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<RaidHubActivitySearchResponse>
    if (data.success) {
        return new Collection(data.response.results.map(r => [r.instanceId, new Activity(r)]))
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
