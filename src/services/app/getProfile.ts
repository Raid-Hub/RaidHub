import AppError from "../../models/errors/AppError"
import { ProfileGetResponse } from "../../types/api"
import { ProfileSocialData, RaidHubProfile } from "../../types/profile"
import { Socials } from "../../util/profile/socials"

export async function getRaidHubProfile(
    destinyMembershipId: string
): Promise<RaidHubProfile | null> {
    const fetchOptions = {
        method: "GET"
    }

    const res = await fetch(`/api/profile/${destinyMembershipId}`, fetchOptions)
    const responseJson = (await res.json()) as ProfileGetResponse
    if (!res.ok || responseJson.success === false) {
        if (responseJson.success === false) {
            throw new AppError(responseJson.error, responseJson.data)
        } else {
            throw new Error("Invalid server response")
        }
    }

    const profile = responseJson.data

    if (!profile) return null
    const socials = new Array<ProfileSocialData>()
    if (profile.bungie_username) {
        socials.push({
            id: Socials.Bungie,
            displayName: profile.bungie_username,
            url: `https://www.bungie.net/7/en/User/Profile/${profile.destiny_membership_type}/${profile.destiny_membership_id}`
        })
    }
    if (profile.discord_username) {
        socials.push({
            id: Socials.Discord,
            displayName: profile.discord_username
        })
    }
    if (profile.twitter_username) {
        socials.push({
            id: Socials.Twitter,
            displayName: profile.twitter_username,
            url: `https://twitter.com/${profile.twitter_username}`
        })
    }
    if (profile.twitch_username) {
        socials.push({
            id: Socials.Twitch,
            displayName: profile.twitch_username,
            url: `https://twitch.tv/${profile.twitch_username}`
        })
    }
    return {
        displayName: profile.name,
        icon: profile.image,
        vanityString: profile.vanity?.string ?? null,
        socials,
        pinnedActivity: profile.pinned_activity_id,
        background: profile.profile_decoration
    }
}
