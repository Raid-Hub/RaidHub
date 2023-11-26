import { DiscordProfile } from "next-auth/providers/discord"

export async function getDiscordProfile(access_token: string) {
    const res = await fetch("https://discord.com/api/users/@me", {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })
    const data = await res.json()
    if (res.ok) {
        return data as DiscordProfile
    } else {
        throw data
    }
}
