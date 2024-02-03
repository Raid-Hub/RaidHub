import "server-only"
export async function getTwitterProfile(access_token: string) {
    const res = await fetch("https://api.twitter.com/2/users/me?user.fields=url", {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    const data = await res.json()
    if (res.ok) {
        return data.data as {
            name: string
            id: string
            username: string
        }
    } else {
        throw data
    }
}
