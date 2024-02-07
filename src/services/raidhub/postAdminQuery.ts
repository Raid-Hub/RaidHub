import { postRaidHubApi } from "."

export const postAdminQueryMutationKey = "raidhub-admin-query"

export async function postAdminQuery(query: string, raidHubAccessToken: string) {
    return postRaidHubApi(
        "/admin/query",
        null,
        { query: query },
        {
            headers: {
                Authorization: "Bearer " + raidHubAccessToken
            }
        }
    )
}
