import { inferAsyncReturnType } from "@trpc/server"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import prisma from "../prisma"
import { auth } from "../next-auth"

export const createContext = async (opts?: CreateNextContextOptions) => {
    const req = opts?.req
    const res = opts?.res

    const session = req && res && (await auth(req, res))

    return {
        req,
        res,
        session,
        prisma: prisma
    }
}

export type Context = inferAsyncReturnType<typeof createContext>
