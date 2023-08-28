import { BungieClientProtocol } from "bungie-net-core"
import { searchByGlobalNamePost } from "bungie-net-core/endpoints/User"
import { UserSearchResponseDetail } from "bungie-net-core/models"

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
            client,
            {
                page
            },
            {
                displayNamePrefix
            }
        )
            .then(res => res.Response)
            .catch(error => {
                if (
                    error.ErrorCode === 217 /**PlatformErrorCodes.UserCannotResolveCentralAccount*/
                ) {
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
