import { User } from "@prisma/client"
import { Awaitable, TokenSet } from "next-auth"
import { TwitchProfile } from "next-auth/providers/twitch"

export function twitchProfile(profile: TwitchProfile, tokens: TokenSet): Awaitable<User> {
    return {
        id: profile.sub,
        name: profile.preferred_username,
        email: profile.email,
        image: profile.picture,
        destinyMembershipId: null,
        destinyMembershipType: null,
        bungie_access_token: null,
        bungie_access_expires_at: null,
        bungie_refresh_token: null,
        bungie_refresh_expires_at: null,
        emailVerified: null
    }
}
