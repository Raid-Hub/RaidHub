import "server-only"

import { prisma } from "../../prisma"
import { getServerSession } from "../auth"

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const session = await getServerSession()

    return {
        prisma: prisma,
        session,
        ...opts
    }
}
