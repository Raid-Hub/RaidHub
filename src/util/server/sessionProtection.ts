import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import prisma from "./prisma"
import { getUserId } from "../../pages/api/user/[userId]"

type Handler<T = any> = (req: NextApiRequest, res: NextApiResponse<T>, userId: string) => unknown

export const protectSession =
    (handler: Handler): NextApiHandler =>
    async (req, res) => {
        const userId = getUserId(req)
        const sessionToken = req.cookies["__Secure-next-auth.session-token"]
        if (!userId || !sessionToken) {
            res.status(401).json({ error: "Unauthorized request" })
            return
        }

        const session = await prisma.session.findFirst({
            where: {
                sessionToken
            }
        })

        if (userId !== session?.userId) {
            res.status(401).json({ error: "Unauthorized request" })
            return
        }

        handler(req, res, userId)
    }
