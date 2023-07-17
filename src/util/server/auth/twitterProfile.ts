import { User } from "@prisma/client"
import { Awaitable, TokenSet } from "next-auth"
import { TwitterProfile } from "next-auth/providers/twitter"

export function twitterProfile({ data }: TwitterProfile, tokens: TokenSet): Awaitable<User> {
    return {
        id: data.id,
        name: data.username,
        image: data.profile_image_url ?? null,
        email: null,
        destinyMembershipId: null,
        destinyMembershipType: null,
        bungie_access_token: null,
        bungie_access_expires_at: null,
        bungie_refresh_token: null,
        bungie_refresh_expires_at: null,
        emailVerified: null
    }
}
