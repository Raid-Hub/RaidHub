import { BungieAPIError } from "bungie-net-core/lib/api"
import { ErrorHandler } from "../../types/generic"
import { PlatformErrorCodes } from "bungie-net-core/lib/models"

export enum ErrorCode {
    Allowed = "",
    Default = "Vanilla",
    BungieAPIOffline = "Bungo",
    ProfileNotFound = "Pinecone",
    PrivateProfile = "Pineapple",
    PGCRError = "Pig",
    ActivityError = "Applesauce",
    ActivityHistory = "Apricot",
    CharacterStats = "Cactus",
    ProfileStats = "Pickle",
    BungieNextMembership = "Banana",
    Clan = "Clam",
    Placements = "Pigeon",
    ExactSearch = "Eggplant",
    Emblems = "Elephant",
    RaidHubProfile = "Rainbow",
    RaidReport = "Reppo",
    Transitory = "Window",
    Manifest = "Mountain"
}

export default class CustomError extends Error {
    code: ErrorCode
    bungieCode?: PlatformErrorCodes
    data?: any

    constructor(message: string, code?: ErrorCode) {
        super(message)
        this.code = code ?? ErrorCode.Default
    }

    static handle(errorHandler: ErrorHandler, e: any, code: ErrorCode) {
        let newErr: CustomError
        if (e instanceof CustomError) {
            e.code = code
            newErr = e
        } else if (e instanceof BungieAPIError) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled) {
                newErr = new CustomError(e.Message, ErrorCode.BungieAPIOffline)
            } else {
                newErr = new CustomError(e.Message, code)
            }
            newErr.bungieCode = e.ErrorCode
            newErr.stack = e.stack
        } else if (e instanceof Error) {
            newErr = new CustomError(e.message, code)
            newErr.stack = e.stack
        } else {
            newErr = new CustomError(String(e), code)
            newErr.data = e
        }
        errorHandler(newErr)
    }
}
