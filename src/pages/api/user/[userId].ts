import { NextApiHandler, NextApiRequest } from "next"
import { BadMethodResponse, UserDeleteResponse, UserUpdateResponse } from "../../../types/api"
import { protectSession } from "../../../util/server/sessionProtection"
import prisma from "../../../util/server/prisma"
import { zUser } from "../../../util/server/zod"

export const getUserId = (req: NextApiRequest): string | undefined =>
    req.url?.split("/")[3]?.toString()

const handler: NextApiHandler = async (req, res) => {
    switch (req.method) {
        case "DELETE":
            await handleDelete(req, res)
            break
        case "PUT":
            await handleUpdate(req, res)
            break
        default:
            res.status(405).json({
                data: { method: req.method! },
                success: false,
                error: "Method not allowed"
            } satisfies BadMethodResponse)
    }
}

export default handler

const handleDelete: NextApiHandler = protectSession(async (req, res, userId) => {
    const ok = async () => {
        await prisma.user
            .delete({
                where: {
                    id: getUserId(req)
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
    }

    const requestCookie = req.cookies["__Host-next-auth.csrf-token"]?.split("|")[0]

    if (!requestCookie) {
        return res.status(401).json({
            data: null,
            success: false,
            error: "Unauthorized"
        } satisfies UserDeleteResponse)
    } else if (req.body.csrfToken === requestCookie) {
        await ok()
    } else {
        res.status(401).json({
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
                    id: getUserId(req)
                },
                data: user
            })
            .then(() =>
                res.status(200).json({
                    success: true,
                    data: user,
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
