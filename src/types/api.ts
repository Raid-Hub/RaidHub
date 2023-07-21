import { User } from "@prisma/client"
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

export type ProtectedSessionError = ApiResponse<false, null>

export type ZodBadRequest<T> = ApiResponse<false, ZodError<T>>

export type UserDeleteResponse =
    | ProtectedSessionError
    | ApiResponse<
          true,
          {
              url: string
          }
      >

export type UserUpdateResponse =
    | ZodBadRequest<User>
    | ProtectedSessionError
    | ApiResponse<true, Partial<User>>
    | ApiResponse<false, undefined>

export type UserImageCreateResponse =
    | ProtectedSessionError
    | ApiResponse<true, { imageUrl: string }>
    | ApiResponse<false, unknown>
