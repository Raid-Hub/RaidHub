import "server-only"
export async function getTwitchProfile(access_token: string) {
    const res = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID!,
            Authorization: `Bearer ${access_token}`
        }
    })

    const data = await res.json()
    if (res.ok) {
        return data.data[0] as {
            id: string
            login: string
            display_name: string
            email: string
        }
    } else {
        throw data
    }
}
