import { User } from "@prisma/client"

export const providerIdToUsernamePropMap: Record<string, keyof User> = {
    bungie: "bungie_username",
    discord: "discord_username",
    twitter: "twitter_username",
    twitch: "twitch_username"
}
