import AppError from "../../models/errors/AppError"
import { Profile, ProfileGetResponse } from "../../types/api"

export async function getRaidHubProfile(destinyMembershipId: string): Promise<Profile | null> {
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

    return responseJson.data
}
