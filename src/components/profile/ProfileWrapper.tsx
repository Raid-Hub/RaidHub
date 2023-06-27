import { useState } from "react"
import { InitialProfileProps } from "../../util/types"
import ErrorComponent from "../Error"
import Profile from "./Profile"
import { NextPage } from "next"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import {
    BungieMembershipType,
    DestinyComponentType,
    PlatformErrorCodes
} from "bungie-net-core/lib/models"
import { getProfile } from "bungie-net-core/lib/endpoints/Destiny2"

type ProfileWrapperProps = InitialProfileProps

const ProfileWrapper: NextPage<ProfileWrapperProps> = ({ bungieNetProfile, errorString }) => {
    const [error, setError] = useState<CustomError | null>(
        errorString ? new CustomError(errorString, ErrorCode.BungieAPIOffline) : null
    )
    if (error) {
        return <ErrorComponent error={error} title={"RaidHub"} />
    } else if (bungieNetProfile) {
        return <Profile {...bungieNetProfile} errorHandler={setError} />
    } else {
        setError(new CustomError("Profile not found", ErrorCode.ProfileNotFound))
        return <></>
    }
}

export async function profileProps({
    destinyMembershipId,
    membershipType
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
}) {
    try {
        const res = await getProfile({
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Profiles, DestinyComponentType.Characters]
        })
        const bungieNetProfile = {
            ...res.Response.profile.data,
            emblemBackgroundPath: Object.values(res.Response.characters.data)[0]
                .emblemBackgroundPath
        }
        return {
            props: {
                bungieNetProfile,
                errorString: ""
            }
        }
    } catch (e: any) {
        let errorString: string
        switch (e.ErrorCode) {
            case PlatformErrorCodes.SystemDisabled:
                errorString = "The Bungie.net API is currently down for maintence."
            case PlatformErrorCodes.ParameterParseFailure:
                errorString = "Profile not found"
            default:
                errorString = e.message ?? "Unknown error"
        }
        return {
            props: {
                bungieNetProfile: null,
                errorString
            }
        }
    }
}

export default ProfileWrapper
