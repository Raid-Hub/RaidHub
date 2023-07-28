import { User } from "@prisma/client"
import { Awaitable } from "next-auth"
import { TwitchProfile } from "next-auth/providers/twitch"

export function twitchProfile(profile: TwitchProfile): Awaitable<User> {
    return {
        id: profile.sub,
        name: profile.preferred_username,
        email: profile.email,
        image: profile.picture,
        destiny_membership_id: null,
        destiny_membership_type: null,
        discord_username: null,
        twitter_username: null,
        twitch_username: profile.preferred_username,
        bungie_username: null,
        bungie_access_token: null,
        bungie_access_expires_at: null,
        bungie_refresh_token: null,
        bungie_refresh_expires_at: null
    }
}
