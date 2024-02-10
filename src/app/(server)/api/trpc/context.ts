import { prisma } from "../../prisma"
import { getServerAuthSession } from "../auth"

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const session = await getServerAuthSession()

    return {
        prisma: prisma,
        session,
        ...opts
    }
}
