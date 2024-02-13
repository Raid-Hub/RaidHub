export function getUserName(user: {
    displayName: string | null
    membershipId: string
    bungieGlobalDisplayName: string | null
    bungieGlobalDisplayNameCode?: string | number | null
}) {
    if (user.bungieGlobalDisplayName && user.bungieGlobalDisplayNameCode) {
        return `${user.bungieGlobalDisplayName}#${user.bungieGlobalDisplayNameCode}`
    } else {
        // Could be empty string, so we can't use nullish coalescing
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return user.displayName || user.membershipId
    }
}
