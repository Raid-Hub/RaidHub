import { NextApiHandler } from "next"
import { ApiHandler, ApiRequest } from "../../../types/api"
import { sessionProtection } from "../../../util/server/sessionProtection"
import prisma from "../../../util/server/prisma"

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "DELETE") {
        await sessionProtection({
            req: req as ApiRequest<"DELETE">,
            res,
            userId: req.body.userId,
            protectedRoute: handleDelete
        })
    }
}

export default handler

const handleDelete: ApiHandler<"DELETE"> = async (req, res) => {
    const ok = async () => {
        await prisma.user.delete({
            where: {
                id: req.body.userId
            }
        })
    }

    const requestCookie = req.cookies["__Host-next-auth.csrf-token"]?.split("|")[0]

    if (!requestCookie) {
        return res.status(401).json({ url: "/newo" })
    } else if (req.body.csrfToken === requestCookie) {
        await ok()
        res.status(200).json({ url: "/newo" })
    } else {
        res.status(401).json({ url: "/newo" })
    }
}
