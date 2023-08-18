import { User } from "@prisma/client"

export const providerIdToUsernamePropMap: Record<string, keyof User> = {
    bungie: "bungieUsername",
    discord: "discordUsername",
    twitter: "twitterUsername",
    twitch: "twitchUsername"
}
