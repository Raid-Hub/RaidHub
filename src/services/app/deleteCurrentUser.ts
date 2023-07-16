import { getCsrfToken, getSession } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils"

type DeleteCurrentUserParams<R extends boolean = true> = {
    callbackUrl?: string
    redirect?: R
}

type DeleteCurrentUserResponse = {
    url: string
}
export async function deleteCurrentUser<R extends boolean = true>(
    options: DeleteCurrentUserParams<R>
): Promise<R extends true ? undefined : DeleteCurrentUserResponse> {
    const { callbackUrl = window.location.href } = options ?? {}

    const session = await getSession()
    if (!session) {
        throw new Error("Failed to delete account: No current session")
    }

    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        // @ts-expect-error
        body: new URLSearchParams({
            userId: session.user.id,
            csrfToken: await getCsrfToken(),
            callbackUrl,
            json: true
        })
    }

    const res = await fetch(`/api/user/${session.user.id}`, fetchOptions)
    if (!res.ok) {
        throw new Error("Unauthorized")
    }
    const data = await res.json()

    if (options?.redirect ?? true) {
        const url = data.url ?? callbackUrl
        window.location.href = url
        // If url contains a hash, the browser does not reload the page. We reload manually
        if (url.includes("#")) window.location.reload()
        // @ts-expect-error
        return
    }

    return data
}
