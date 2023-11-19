import { BungieAPIError } from "./BungieAPIError"
import { PlatformErrorCodes } from "bungie-net-core/models"

export enum ErrorCode {
    Allowed = "",
    Default = "Vanilla",
    BungieAPIOffline = "Bungo",
    ProfileNotFound = "Pinecone",
    PrivateProfile = "Pineapple",
    DestinyProfile = "Deathstar",
    PGCR = "Pig",
    ActivityHistory = "Apricot",
    CharacterStats = "Cactus",
    ProfileStats = "Pickle",
    BungieNextMembership = "Banana",
    Clan = "Clam",
    Placements = "Pigeon",
    Emblems = "Elephant",
    RaidHubProfile = "Rainbow",
    Transitory = "Window",
    Manifest = "Mountain",
    Search = "Sapphire",
    ActivitySearch = "Applesauce"
}

export default class CustomError extends Error {
    code: ErrorCode
    bungieCode?: PlatformErrorCodes
    data?: any

    constructor(message: string, code: ErrorCode, stack: string | undefined) {
        super(message)
        this.code = code ?? ErrorCode.Default
        this.stack = stack
    }

    static handle(e: unknown, code: ErrorCode) {
        let newErr: CustomError
        if (e instanceof CustomError) {
            newErr = e
            newErr.code = code
        } else if (e instanceof BungieAPIError) {
            if (e.ErrorCode === 5 /**PlatformErrorCodes.SystemDisabled*/) {
                newErr = new CustomError(e.Message, ErrorCode.BungieAPIOffline, e.stack)
            } else {
                newErr = new CustomError(e.Message, code, e.stack)
            }
            newErr.bungieCode = e.ErrorCode
        } else if (e instanceof Error) {
            newErr = new CustomError(e.message, code, e.stack)
        } else {
            newErr = new CustomError(JSON.stringify(e), code, undefined)
            Error.captureStackTrace(newErr)
        }
        return newErr
    }
}
