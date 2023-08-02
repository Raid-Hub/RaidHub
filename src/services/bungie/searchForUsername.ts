import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { PlatformErrorCodes, UserSearchResponseDetail } from "bungie-net-core/lib/models"
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
        )
            .then(res => res.Response)
            .catch(error => {
                if (error.ErrorCode === PlatformErrorCodes.UserCannotResolveCentralAccount) {
                    return {
                        searchResults: new Array<UserSearchResponseDetail>(),
                        hasMore: false
                    }
                } else {
                    throw error
                }
            })
    const results = new Array<UserSearchResponseDetail[]>()
    let page = 0
    let keepSearching = true
    while (keepSearching && page < pages) {
        const { hasMore, searchResults } = await search(page)
        results.push(searchResults)
        keepSearching = hasMore
        page++
    }

    return results.flat()
}
