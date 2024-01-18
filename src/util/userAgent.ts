export function isBot(userAgent: string) {
    return userAgent.toLowerCase().includes("bot")
}
