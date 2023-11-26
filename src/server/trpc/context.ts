import { inferAsyncReturnType } from "@trpc/server"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import prisma from "../prisma"
import { auth } from "../next-auth"

export const createContext = async (opts?: CreateNextContextOptions) => {
    const req = opts?.req
    const res = opts?.res

    // stupid fuckery to get around a next auth issue, i hate it
    const fakeRes = new Response()
    const session =
        req &&
        res &&
        (await auth(
            req,
            // @ts-ignore
            fakeRes
        ))

    res &&
        fakeRes.headers.forEach((value, key) => {
            res.setHeader(key, value)
        })

    return {
        req,
        res,
        session,
        prisma: prisma
    }
}

export type Context = inferAsyncReturnType<typeof createContext>
