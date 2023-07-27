import { User } from "@prisma/client"
import { Awaitable } from "next-auth"
import { DiscordProfile } from "next-auth/providers/discord"

export function discordProfile(profile: DiscordProfile): Awaitable<User> {
    console.log(profile)
    if (profile.avatar === null) {
        const defaultAvatarNumber = parseInt(profile.discriminator) % 5
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
    } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png"
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
    }
    return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: profile.image_url,
        destiny_membership_id: null,
        destiny_membership_type: null,
        twitch_username: null,
        bungie_username: null,
        discord_username: profile.username,
        twitter_username: null,
        bungie_access_token: null,
        bungie_access_expires_at: null,
        bungie_refresh_token: null,
        bungie_refresh_expires_at: null
    }
}
