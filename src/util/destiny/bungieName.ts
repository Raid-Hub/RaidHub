export function getUserName(user: {
    displayName: string | null
    membershipId: string
    bungieGlobalDisplayName: string | null
    bungieGlobalDisplayNameCode: string | number | null
}) {
    if (user.bungieGlobalDisplayName && user.bungieGlobalDisplayNameCode) {
        return `${user.bungieGlobalDisplayName}#${user.bungieGlobalDisplayNameCode}`
    } else {
        return user.displayName || user.membershipId
    }
}
