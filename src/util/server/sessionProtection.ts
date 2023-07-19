import { NextApiRequest, NextApiResponse } from "next"
import prisma from "./prisma"

type SessionProtectionParams = {
    req: NextApiRequest
    res: NextApiResponse
    userId: string | undefined
}

export async function protectSession({
    req,
    res,
    userId
}: SessionProtectionParams): Promise<boolean> {
    const sessionToken = req.cookies["__Secure-next-auth.session-token"]
    if (!userId || !sessionToken) {
        res.status(401).json({ error: "Unauthorized request" })
        return false
    }

    const session = await prisma.session.findFirst({
        where: {
            sessionToken
        }
    })

    if (userId !== session?.userId) {
        res.status(401).json({ error: "Unauthorized request" })
        return false
    }

    return true
}
