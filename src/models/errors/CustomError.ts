import { ErrorHandler } from "../../util/types"

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
    Emblems = "Elephant"
}

export default class CustomError extends Error {
    readonly code: ErrorCode

    constructor(message: string, code?: ErrorCode) {
        super(message)
        this.code = code ?? ErrorCode.Default
    }

    static handle(errorHandler: ErrorHandler, e: any, code: ErrorCode) {
        if (e instanceof CustomError) {
            errorHandler(e)
        } else if (e instanceof Error) {
            errorHandler(new CustomError(e.message, code))
        } else {
            errorHandler(new CustomError(String(e), code))
        }
    }
}
