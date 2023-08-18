import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import prisma from "./prisma"

const getUserId = (req: NextApiRequest): string | undefined => req.url?.split("/")[3]?.toString()

type Handler<T = any> = (req: NextApiRequest, res: NextApiResponse<T>, userId: string) => unknown

export const protectSession =
    (handler: Handler): NextApiHandler =>
    async (req, res) => {
        const userId = getUserId(req)
        const sessionToken = req.cookies["__Secure-next-auth.session-token"]
        if (!userId || !sessionToken) {
            return res.status(401).json({ error: "Unauthorized request" })
        }

        const session = await prisma.session.findFirst({
            where: {
                sessionToken
            }
        })

        if (userId !== session?.userId) {
            return res.status(401).json({ error: "Unauthorized request" })
        }

        return handler(req, res, userId)
    }
