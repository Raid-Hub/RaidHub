import { BungieMembershipType } from "bungie-net-core/lib/models"
import CustomError from "../models/errors/CustomError"

export type CustomBungieSearchResult = {
    bungieGlobalDisplayName: string
    bungieGlobalDisplayNameCode?: number
    displayName: string
    membershipType: BungieMembershipType
    membershipId: string
}
export enum Loading {
    FALSE,
    LOADING,
    HYDRATING
}
export type Flatten<T> = T extends ReadonlyArray<infer U> ? U : never
export type ErrorHandler = (error: CustomError) => void
export type FilterCallback<T> = (value: T) => boolean
