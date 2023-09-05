import { NextApiHandler } from "next"
import { BadMethodResponse, ProfileUpdateResponse } from "@/types/api"
import { protectSession } from "@/util/server/sessionProtection"
import prisma from "server/prisma"
import { zProfile } from "@/util/zod"

const handler: NextApiHandler = async (req, res) => {
    switch (req.method) {
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

const handleUpdate: NextApiHandler = protectSession(async (req, res, userId) => {
    try {
        const user = zProfile.partial().parse(req.body)

        await prisma.profile
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
                } satisfies ProfileUpdateResponse)
            )
            .catch(err =>
                res.status(500).json({
                    success: false,
                    data: err,
                    error: err.message
                } satisfies ProfileUpdateResponse)
            )
    } catch (e: any) {
        res.status(400).json({
            success: false,
            error: "Bad request",
            data: e
        } satisfies ProfileUpdateResponse)
    }
})
