export function isBot(userAgent: string) {
    return userAgent.includes("Discordbot/") || userAgent.includes("Twitterbot/")
}
