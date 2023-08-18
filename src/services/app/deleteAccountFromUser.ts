import { getSession } from "next-auth/react"
import { UserAccountDeleteResponse } from "../../types/api"
import AppError from "../../models/errors/AppError"

type DeleteCurrentUser = (options: { providerId: string }) => Promise<{ message: string }>

export const unlinkAccountFromUser: DeleteCurrentUser = async ({ providerId }) => {
    const session = await getSession()
    if (!session) {
        throw new Error("Failed to remove linked account: No current session")
    }

    const res = await fetch(
        `/api/user/${session.user.id}/accounts?${new URLSearchParams({ providerId }).toString()}`,
        {
            method: "DELETE"
        }
    )
    const responseJson = (await res.json()) as UserAccountDeleteResponse

    if (!res.ok || responseJson.success === false) {
        if (responseJson.success === false) {
            throw new AppError(responseJson.error, responseJson.data)
        } else {
            throw new Error("Invalid server response")
        }
    }

    return responseJson.data
}
