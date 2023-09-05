import { Profile, User } from "@prisma/client"
import { UserUpdateResponse } from "../../types/api"
import AppError from "../../models/errors/AppError"
import { Session } from "next-auth"
import { zProfile } from "@/util/zod"
import { z } from "zod"

type UpdateCurrentProfile = (
    data: Partial<z.infer<typeof zProfile>>,
    session: Session
) => Promise<{
    updated: Profile
}>
export const updateCurrentProfile: UpdateCurrentProfile = async (data, session) => {
    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    const res = await fetch(`/api/profile/${session.user.id}`, fetchOptions)
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
