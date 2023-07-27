import { User } from "@prisma/client"
import { Awaitable } from "next-auth"
import { TwitterProfile } from "next-auth/providers/twitter"

export function twitterProfile({ data }: TwitterProfile): Awaitable<User> {
    return {
        id: data.id,
        name: data.username,
        image: data.profile_image_url ?? null,
        email: null,
        discord_username: null,
        twitch_username: null,
        bungie_username: null,
        twitter_username: data.username,
        destiny_membership_id: null,
        destiny_membership_type: null,
        bungie_access_token: null,
        bungie_access_expires_at: null,
        bungie_refresh_token: null,
        bungie_refresh_expires_at: null
    }
}
