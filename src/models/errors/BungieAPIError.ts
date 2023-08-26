import { PlatformErrorCodes } from "bungie-net-core/enums"
import { BungieNetResponse } from "bungie-net-core/models"

export class BungieAPIError<T> extends Error implements BungieNetResponse<T> {
    readonly DetailedErrorTrace: string
    readonly ErrorCode: (typeof PlatformErrorCodes)[keyof typeof PlatformErrorCodes]
    readonly ErrorStatus: string
    readonly Message: string
    readonly MessageData: Record<string, string>
    readonly Response: T
    readonly ThrottleSeconds: number

    constructor(response: BungieNetResponse<T>) {
        super()
        this.name = "BungieAPIError"
        this.DetailedErrorTrace = response.DetailedErrorTrace
        this.ErrorCode = response.ErrorCode
        this.ErrorStatus = response.ErrorStatus
        this.MessageData = response.MessageData
        this.Message = response.Message
        this.MessageData = response.MessageData
        this.Response = response.Response
        this.ThrottleSeconds = response.ThrottleSeconds
    }

    get message(): string {
        return this.Message
    }
}
