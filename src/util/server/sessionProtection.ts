import { NextApiResponse } from "next"
import { ApiHandler, ApiMethod, ApiRequest } from "../../types/api"
import prisma from "./prisma"

type SessionProtectionParams<T extends ApiMethod> = {
    req: ApiRequest<T>
    res: NextApiResponse
    userId: string | undefined
    protectedRoute: ApiHandler<T>
}

export async function sessionProtection<T extends ApiMethod>({
    req,
    res,
    userId,
    protectedRoute
}: SessionProtectionParams<T>) {
    const sessionToken = req.cookies["__Secure-next-auth.session-token"]
    if (!userId || !sessionToken) {
        return res.status(401).json({ error: "Unauthorized request" })
    }

    const session = await prisma.session.findFirst({
        where: {
            sessionToken
        }
    })

    if (userId === session?.userId) {
        await protectedRoute(req, res)
    } else {
        res.status(401).json({ error: "Unauthorized request" })
    }
}
