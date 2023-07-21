import { getCsrfToken, getSession } from "next-auth/react"
import { UserDeleteResponse } from "../../types/api"
import AppError from "../../models/errors/AppError"

type DeleteCurrentUser = (options: { callbackUrl?: string; redirect?: boolean }) => Promise<
    | {
          url: string
      }
    | undefined
>
export const deleteCurrentUser: DeleteCurrentUser = async options => {
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
        body: new URLSearchParams({
            csrfToken: (await getCsrfToken()) ?? "null",
            callbackUrl
        })
    }

    const res = await fetch(`/api/user/${session.user.id}`, fetchOptions)
    const responseJson = (await res.json()) as UserDeleteResponse
    if (!res.ok || responseJson.success === false) {
        if (responseJson.success === false) {
            throw new AppError(responseJson.error, responseJson.data)
        } else {
            throw new Error("Invalid server response")
        }
    }

    if (options?.redirect ?? true) {
        const url = responseJson.data?.url ?? callbackUrl
        window.location.href = url
        // If url contains a hash, the browser does not reload the page. We reload manually
        if (url.includes("#")) window.location.reload()
        return
    } else {
        return responseJson.data
    }
}
