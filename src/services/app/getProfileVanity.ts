import { BungieMembershipType } from "bungie-net-core/models"
import AppError from "@/models/errors/AppError"
import { ProfileVanityGetResponse } from "@/types/api"

export async function getProfileVanity({
    destinyMembershipId,
    destinyMembershipType
}: {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
}) {
    const fetchOptions = {
        method: "GET"
    }

    const res = await fetch(
        `/api/profile/vanity?${new URLSearchParams({
            destinyMembershipId,
            destinyMembershipType: destinyMembershipType.toString()
        }).toString()}`,
        fetchOptions
    )
    const responseJson = (await res.json()) as ProfileVanityGetResponse
    if (!res.ok || responseJson.success === false) {
        if (responseJson.success === false) {
            throw new AppError(responseJson.error, responseJson.data)
        } else {
            throw new Error("Invalid server response")
        }
    }

    return responseJson.data
}
