import { User } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { ZodError } from "zod"

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE"

interface ApiResponse<S extends boolean, D = unknown> {
    success: S
    error: S extends true ? undefined : string
    data: D
}

type ProtectedSessionErrorResponse = ApiResponse<false, null>

type ZodBadRequest<T> = ApiResponse<false, ZodError<T>>

export type BadMethodResponse = ApiResponse<
    false,
    {
        method: string
    }
>

export type UserDeleteResponse =
    | BadMethodResponse
    | ProtectedSessionErrorResponse
    | ApiResponse<
          true,
          {
              url: string
          }
      >

export type UserUpdateResponse =
    | BadMethodResponse
    | ZodBadRequest<User>
    | ProtectedSessionErrorResponse
    | ApiResponse<true, User>
    | ApiResponse<false, undefined>

export type UserImageCreateResponse =
    | BadMethodResponse
    | ProtectedSessionErrorResponse
    | ApiResponse<true, { imageUrl: string }>
    | ApiResponse<false, unknown>

export type UserAccountDeleteResponse =
    | BadMethodResponse
    | ProtectedSessionErrorResponse
    | ApiResponse<true, { message: string }>
    | ApiResponse<false, unknown>

export type Profile = {
    name: string
    image: string
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
    bungieUsername: string | null
    discordUsername: string | null
    twitchUsername: string | null
    twitterUsername: string | null
    pinnedActivityId: string | null
    profileDecoration: string | null
    vanity: {
        string: string | null
    } | null
}

export type ProfileGetResponse =
    | BadMethodResponse
    | ApiResponse<true, Profile | null>
    | ApiResponse<
          false,
          {
              destinyMembershipId: any
          }
      >

export type ProfileVanityGetResponse =
    | BadMethodResponse
    | ApiResponse<true, { string: string } | null>
    | ApiResponse<false, any>

export type ProfilePinPGCRUpdateResponse =
    | BadMethodResponse
    | ProtectedSessionErrorResponse
    | ApiResponse<true, { activityId: string | null }>
    | ApiResponse<false, any>
