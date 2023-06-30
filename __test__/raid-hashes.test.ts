import { expect, describe, test } from "@jest/globals"
import BungieNetClient, { ACTIVITIES_PER_PAGE } from "../src/services/bungie/bungieClient"
import { BungieMembershipType } from "bungie-net-core/models"
import { AllValidHashes } from "../src/util/destiny/raid"

const shared = new BungieNetClient()

describe("all raid hashes accounted for", () => {
    describe("gladd", () => {
        const destinyMembershipId = "4611686018471180200"
        ;["2305843009300583068", "2305843009299042074", "2305843009359474912"].map(
            (characterId, idx) =>
                test(`character ${idx + 1}`, async () => {
                    const getHistory = async (page: number) =>
                        shared.getActivityHistory(
                            destinyMembershipId,
                            characterId,
                            BungieMembershipType.TigerSteam,
                            page
                        )

                    let history = await getHistory(0),
                        page = 0
                    while (history.length === ACTIVITIES_PER_PAGE) {
                        history = await getHistory(page)
                        history.map(activity =>
                            expect(AllValidHashes).toContain(
                                activity.activityDetails.directorActivityHash.toString()
                            )
                        )
                        page++
                    }
                }, 60000)
        )
    })

    describe("datto", () => {
        const destinyMembershipId = "4611686018467284386"
        ;["2305843009300009399", "2305843009300009440", "2305843009300406282"].map(
            (characterId, idx) =>
                test(`character ${idx + 1}`, async () => {
                    const getHistory = async (page: number) =>
                        shared.getActivityHistory(
                            destinyMembershipId,
                            characterId,
                            BungieMembershipType.TigerSteam,
                            page
                        )

                    let history = await getHistory(0),
                        page = 0
                    while (history.length === ACTIVITIES_PER_PAGE) {
                        history = await getHistory(page)
                        history.map(activity =>
                            expect(AllValidHashes).toContain(
                                activity.activityDetails.directorActivityHash.toString()
                            )
                        )
                        page++
                    }
                }, 60000)
        )
    })
})
