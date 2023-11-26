import { TwitterProfile } from "next-auth/providers/twitter"

export async function getTwitterProfile(access_token: string) {
    const res = await fetch("https://api.twitter.com/2/users/me", {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    const data = await res.json()
    if (res.ok) {
        return data.data as TwitterProfile["data"]
    } else {
        throw data
    }
}
