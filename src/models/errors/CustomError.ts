import { ErrorHandler } from "../../types/generic"

export enum ErrorCode {
    Allowed = "",
    Default = "Vanilla",
    BungieAPIOffline = "Bungo",
    ProfileNotFound = "Pinecone",
    PrivateProfile = "Pineapple",
    PGCRError = "Pig",
    ActivityHistory = "Apricot",
    CharacterStats = "Cactus",
    ProfileStats = "Pickle",
    BungieNextMembership = "Banana",
    Clan = "Clam",
    Placements = "Pigeon",
    ExactSearch = "Eggplant",
    Emblems = "Elephant",
    RaidHubProfile = "Rainbow"
}

export default class CustomError extends Error {
    code: ErrorCode

    constructor(message: string, code?: ErrorCode) {
        super(message)
        this.code = code ?? ErrorCode.Default
    }

    static handle(errorHandler: ErrorHandler, e: any, code: ErrorCode) {
        if (e instanceof CustomError) {
            e.code = code
            errorHandler(e)
        } else if (e instanceof Error) {
            errorHandler(new CustomError(e.message, code))
        } else {
            errorHandler(new CustomError(String(e), code))
        }
    }
}
