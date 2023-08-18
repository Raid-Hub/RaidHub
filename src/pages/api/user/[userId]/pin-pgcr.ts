import { NextApiHandler } from "next"
import { BadMethodResponse, ProfilePinPGCRUpdateResponse } from "../../../../types/api"
import { protectSession } from "../../../../util/server/sessionProtection"
import prisma from "../../../../util/server/prisma"
import { z } from "zod"

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "PUT") {
        await handleUpdate(req, res)
    } else {
        res.status(405).json({
            data: { method: req.method! },
            success: false,
            error: "Method not allowed"
        } satisfies BadMethodResponse)
    }
}

export default handler

const handleUpdate: NextApiHandler = protectSession(async (req, res, userId) => {
    try {
        const schema = z.object({
            activityId: z.nullable(z.string().regex(/^\d+$/))
        })
        const { activityId } = schema.parse(req.body)

        await prisma.user
            .update({
                where: {
                    id: userId
                },
                data: {
                    pinnedActivityId: activityId
                },
                select: {
                    pinnedActivityId: true
                }
            })
            .then(result =>
                res.status(201).json({
                    success: true,
                    error: undefined,
                    data: {
                        activityId: result.pinnedActivityId
                    }
                } satisfies ProfilePinPGCRUpdateResponse)
            )
            .catch(err =>
                res.status(500).json({
                    success: false,
                    error: "Failed to pin activity",
                    data: {
                        activityId
                    }
                } satisfies ProfilePinPGCRUpdateResponse)
            )
    } catch (e) {
        res.status(400).json({
            success: false,
            error: "Bad request",
            data: {
                body: req.body
            }
        } satisfies ProfilePinPGCRUpdateResponse)
    }
})
