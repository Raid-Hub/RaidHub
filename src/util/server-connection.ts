import { Tags } from "./tags"

type ActivityPlacementsResponse = {

} 

export type ActivityPlacements = {[key: string]: number }

export async function fetchActivityPlacements(activityId: string): Promise<ActivityPlacements> {
    // TODO: THIS FUNCTIONALITY IS CURRENTLY MOCKED
    return new Promise(resolve => {
        const fakeRes: ActivityPlacements = {
            [Tags.Trio]: 3,
            [Tags.ChallengeKF]: 5,
            [Tags.DayOne]: 5,
            [Tags.Master]: 1,
            [Tags.Duo]: 7,
            [Tags.Solo]: 97
        }
        setTimeout(resolve, 2000, fakeRes)
    })
}