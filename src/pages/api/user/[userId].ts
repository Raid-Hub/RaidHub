import { NextApiHandler } from "next"
import { BadMethodResponse, UserDeleteResponse, UserUpdateResponse } from "../../../types/api"
import { protectSession } from "../../../util/server/sessionProtection"
import prisma from "../../../util/server/prisma"
import { zUser } from "../../../util/server/zod"

const handler: NextApiHandler = async (req, res) => {
    switch (req.method) {
        case "DELETE":
            return await handleDelete(req, res)
        case "PUT":
            return await handleUpdate(req, res)
        default:
            return res.status(405).json({
                data: { method: req.method! },
                success: false,
                error: "Method not allowed"
            } satisfies BadMethodResponse)
    }
}

export default handler

const handleDelete: NextApiHandler = protectSession(async (req, res, userId) => {
    const ok = () =>
        prisma.user
            .delete({
                where: {
                    id: userId
                }
            })
            .then(() =>
                res.status(200).json({
                    success: true,
                    data: { url: req.body.callbackUrl },
                    error: undefined
                } satisfies UserDeleteResponse)
            )
            .catch(err =>
                res.status(500).json({
                    success: false,
                    error: err.message,
                    data: err
                } satisfies UserDeleteResponse)
            )

    const requestCookie = req.cookies["__Host-next-auth.csrf-token"]?.split("|")[0]

    if (!requestCookie) {
        return res.status(401).json({
            data: null,
            success: false,
            error: "Unauthorized"
        } satisfies UserDeleteResponse)
    } else if (req.body.csrfToken === requestCookie) {
        return ok()
    } else {
        return res.status(401).json({
            success: false,
            data: null,
            error: "Invalid CSFR token"
        } satisfies UserDeleteResponse)
    }
})

const handleUpdate: NextApiHandler = protectSession(async (req, res, userId) => {
    try {
        const user = zUser.partial().parse(req.body)

        await prisma.user
            .update({
                where: {
                    id: userId
                },
                data: user
            })
            .then(updated =>
                res.status(200).json({
                    success: true,
                    data: updated,
                    error: undefined
                } satisfies UserUpdateResponse)
            )
            .catch(err =>
                res.status(500).json({
                    success: false,
                    data: err,
                    error: err.message
                } satisfies UserUpdateResponse)
            )
    } catch (e: any) {
        res.status(400).json({
            success: false,
            error: "Bad request",
            data: e
        } satisfies UserUpdateResponse)
    }
})
