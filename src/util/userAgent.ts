export function isBot(userAgent: string | undefined) {
    return userAgent?.includes("Discordbot") || userAgent?.includes("Twitterbot")
}
