import { BungieClientProtocol } from "bungie-net-core"
import { RaidHubPlayerSearchResult } from "~/types/raidhub-api"
import { getRaidHubApi } from "."
import { searchForBungieName } from "../bungie/searchForBungieName"
import { searchForUsername } from "../bungie/searchForUsername"

// we have the bungie queries as backups
export async function searchRaidHubUser(
    query: string,
    bungieClient: BungieClientProtocol
): Promise<readonly RaidHubPlayerSearchResult[]> {
    try {
        const data = await getRaidHubApi("/player/search", null, { query })
        if (data.results.length > 0) {
            return data.results
        }
    } catch (e) {
        console.error(e)
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
            res.map((r): RaidHubPlayerSearchResult => {
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
