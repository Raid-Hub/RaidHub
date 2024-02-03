import { getServerAuthSession } from "../auth"
import { prisma } from "../prisma"

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const session = await getServerAuthSession()

    return {
        prisma: prisma,
        session,
        ...opts
    }
}
