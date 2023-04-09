import { Tag } from "../tags"
import { ActivityPlacements } from "../types"

export async function fetchActivityPlacements(activityId: string): Promise<ActivityPlacements> {
    // TODO: THIS FUNCTIONALITY IS CURRENTLY MOCKED
    return new Promise(resolve => {
        const fakeRes: ActivityPlacements = {
            // [Tag.ChallengeKF]: Math.floor(Math.random() * 100),
            // [Tag.DayOne]: Math.floor(Math.random() * 100),
            // [Tag.Contest]: Math.floor(Math.random() * 100),
            // [Tag.Trio]: Math.floor(Math.random() * 100),
            // [Tag.Duo]: Math.floor(Math.random() * 100),
            // [Tag.Solo]: Math.floor(Math.random() * 100),
        }
        setTimeout(resolve, 1200, fakeRes)
    })
}