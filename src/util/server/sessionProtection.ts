import { NextApiResponse } from "next"
import { ApiMethod, ApiRequest } from "../../types/api"
import prisma from "./prisma"

type SessionProtectionParams<T extends ApiMethod> = {
    req: ApiRequest<T>
    res: NextApiResponse
    userId: string | undefined
}

export async function protectSession<T extends ApiMethod>({
    req,
    res,
    userId
}: SessionProtectionParams<T>): Promise<boolean> {
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
