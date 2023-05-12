import { useState } from "react"
import { InitialProfileProps } from "../../util/types"
import ErrorComponent from "../Error"
import Profile from "./Profile"
import { NextPage } from "next"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"

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

export default ProfileWrapper
