import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

export type ApiMethod = "GET" | "POST" | "UPDATE" | "DELETE"
export type ApiRequest<M extends ApiMethod> = NextApiRequest & { method: M }
export type ApiHandler<M extends ApiMethod, R = any> = (
    req: ApiRequest<M>,
    res: NextApiResponse<R>
) => unknown | Promise<unknown>
