import { RaidHubAPIResponse, RaidHubSearchResponse, RaidHubSearchResult } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { searchForBungieName } from "../bungie/searchForBungieName"
import { searchForUsername } from "../bungie/searchForUsername"
import { BungieClientProtocol } from "bungie-net-core"
import { createHeaders } from "."

// we have the bungie queries as backups
export async function searchRaidHubUser(
    query: string,
    bungieClient: BungieClientProtocol
): Promise<RaidHubSearchResult[]> {
    const url = new URL(getRaidHubBaseUrl() + `/player/search`)
    url.searchParams.append("query", query)

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<RaidHubSearchResponse>
    if (!data.success) {
        const err = new Error(data.message)
        Object.assign(err, data.error)
        console.error(err)
    } else if (data.response.results.length > 0) {
        return data.response.results
    }

    // if we fail, let's try bungie
    const [displayName, displayNameCode] = query.split("#")

    const [exact, moreResults] = await Promise.all([
        searchForBungieName({
            client: bungieClient,
            displayName,
            displayNameCode: Number(displayNameCode)
        })
            .then(res => {
                return {
                    membershipId: res.membershipId,
                    membershipType: res.membershipType,
                    iconPath: res.iconPath,
                    displayName: res.displayName,
                    lastSeen: "",
                    clears: 0,
                    ...(res.bungieGlobalDisplayNameCode
                        ? {
                              bungieGlobalDisplayName: res.bungieGlobalDisplayName,
                              bungieGlobalDisplayNameCode: String(res.bungieGlobalDisplayNameCode)
                          }
                        : {
                              bungieGlobalDisplayName: null,
                              bungieGlobalDisplayNameCode: null
                          })
                }
            })
            .catch(e => null),
        searchForUsername({
            client: bungieClient,
            displayNamePrefix: displayName,
            pages: 2
        }).then(res =>
            res.map((r): RaidHubSearchResult => {
                const membership = r.destinyMemberships[0]
                return {
                    membershipId: membership.membershipId,
                    membershipType: membership.membershipType,
                    iconPath: membership.iconPath,
                    displayName: membership.displayName,
                    lastSeen: "",
                    clears: 0,
                    ...(membership.bungieGlobalDisplayNameCode
                        ? {
                              bungieGlobalDisplayName: membership.bungieGlobalDisplayName,
                              bungieGlobalDisplayNameCode: String(
                                  membership.bungieGlobalDisplayNameCode
                              )
                          }
                        : {
                              bungieGlobalDisplayName: null,
                              bungieGlobalDisplayNameCode: null
                          })
                }
            })
        )
    ])
    return exact ? [exact, ...moreResults] : moreResults
}
