export function activitiesQueryKey(membershipId: string) {
    return ["raidhub-activities", membershipId] as const
}

export async function getActivities(destinyMembershipId: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
        {
            characterId: "string",
            activityId: "13937711043",
            started: new Date(),
            ended: new Date(),
            hash: 16382826383,
            flawless: true,
            playerCount: 3,
            completed: true,
            startedFromBeginning: true,
            players: [
                {
                    destinyMembershipId: destinyMembershipId,
                    destinyMembershipType: 3,
                    name: "Newo"
                }
            ]
        }
    ]
}
