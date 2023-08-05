import { User } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { NextApiRequest, NextApiResponse } from "next"
import { ZodError } from "zod"

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE"
export type ApiRequest<M extends ApiMethod> = NextApiRequest & { method: M }
export type ApiHandler<M extends ApiMethod, R = any> = (
    req: ApiRequest<M>,
    res: NextApiResponse<R>
) => unknown | Promise<unknown>

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
    | ApiResponse<true, Partial<User>>
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
    destiny_membership_id: string
    destiny_membership_type: BungieMembershipType
    bungie_username: string | null
    discord_username: string | null
    twitch_username: string | null
    twitter_username: string | null
    pinned_activity_id: string | null
    profile_decoration: string | null
    vanity: {
        string: string | null
    } | null
}

export type ProfileGetResponse =
    | BadMethodResponse
    | ApiResponse<true, Profile>
    | ApiResponse<
          false,
          {
              destinyMembershipId: any
          }
      >
