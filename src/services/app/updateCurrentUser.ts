import { User } from "@prisma/client"
import { getSession } from "next-auth/react"
import { UserUpdateResponse } from "../../types/api"
import AppError from "../../models/errors/AppError"
import { ModifiableUser } from "../../types/profile"

type UpdateCurrentUser = (data: ModifiableUser) => Promise<{
    updated: User
}>
export const updateCurrentUser: UpdateCurrentUser = async data => {
    const session = await getSession()
    if (!session) {
        throw new Error("Failed to delete account: No current session")
    }

    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    const res = await fetch(`/api/user/${session.user.id}`, fetchOptions)
    const responseJson = (await res.json()) as UserUpdateResponse
    if (!res.ok || responseJson.success === false) {
        if (responseJson.success === false) {
            throw new AppError(responseJson.error, responseJson.data)
        } else {
            throw new Error("Invalid server response")
        }
    }

    return {
        updated: responseJson.data
    }
}
