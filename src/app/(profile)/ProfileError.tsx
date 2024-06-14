"use client"

import { useQuery } from "@tanstack/react-query"
import { ErrorCard } from "~/components/ErrorCard"
import { usePageProps } from "~/components/layout/PageWrapper"
import { RaidHubError } from "~/services/raidhub/RaidHubError"
import { getRaidHubApi } from "~/services/raidhub/common"
import { type RaidHubErrorCode } from "~/services/raidhub/types"
import { type ProfileProps } from "./types"

export const ProfileError = () => {
    const { destinyMembershipId } = usePageProps<ProfileProps>()
    const { isError, error } = useQuery({
        queryFn: () =>
            getRaidHubApi(
                "/player/{membershipId}/profile",
                { membershipId: destinyMembershipId },
                null
            ).then(res => res.response),
        queryKey: ["raidhub", "player", destinyMembershipId] as const,
        enabled: false
    })
    if (isError && error instanceof RaidHubError) {
        return (
            <ErrorCard>
                <p>
                    Error loading Profile: <code>{error.errorCode}</code>
                </p>
                <p>{getMessage(error.errorCode)}</p>
            </ErrorCard>
        )
    } else {
        return null
    }
}

const getMessage = (errorCode: RaidHubErrorCode) => {
    switch (errorCode) {
        case "PlayerPrivateProfileError":
            return "The owner of this profile has chosen to keep their activity history private. No Peeking!"
        case "PlayerNotFoundError":
            return "This profile does not exist in RaidHub's database."
        default:
            return "An error occurred"
    }
}
