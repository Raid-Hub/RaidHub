import "server-only"

import { prisma } from "../../prisma"

export const createTRPCContext = async (opts: { headers: Headers }) => {
    return {
        prisma: prisma,
        ...opts
    }
}
