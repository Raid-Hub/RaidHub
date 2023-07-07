import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { UserSearchResponseDetail } from "bungie-net-core/lib/models"
import { searchByGlobalNamePost } from "bungie-net-core/lib/endpoints/User"

export async function searchForUsername({
    displayNamePrefix,
    pages,
    client
}: {
    displayNamePrefix: string
    pages: number
    client: BungieClientProtocol
}): Promise<UserSearchResponseDetail[]> {
    const search = async (page: number) =>
        searchByGlobalNamePost(
            {
                page
            },
            {
                displayNamePrefix
            },
            client
        ).then(res => res.Response.searchResults)

    const results = await Promise.allSettled(
        new Array(pages).fill(null).map(async (_, pageNumber) => search(pageNumber))
    )

    const successes = results.filter(
        r =>
            r.status === "fulfilled" &&
            (r as PromiseFulfilledResult<UserSearchResponseDetail[]>).value
    ) as PromiseFulfilledResult<UserSearchResponseDetail[]>[]
    return successes.map(s => s.value).flat() ?? []
}
