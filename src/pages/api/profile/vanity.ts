import { NextApiHandler } from "next"
import { BadMethodResponse, ProfileVanityGetResponse } from "../../../types/api"
import prisma from "../../../util/server/prisma"
import { zUniqueDestinyProfile } from "../../../util/server/zod"

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "GET") {
        await handleGet(req, res)
    } else {
        res.status(405).json({
            data: { method: req.method! },
            success: false,
            error: "Method not allowed"
        } satisfies BadMethodResponse)
    }
}

export default handler

const handleGet: NextApiHandler = async (req, res) => {
    try {
        const { destinyMembershipId, destinyMembershipType } = zUniqueDestinyProfile.parse(
            req.query
        )
        try {
            const vanity = await prisma.vanity.findUnique({
                where: {
                    destinyMembershipId_destinyMembershipType: {
                        destinyMembershipId,
                        destinyMembershipType
                    }
                },
                select: {
                    string: true
                }
            })

            res.status(200).json({
                data: vanity,
                success: true,
                error: undefined
            } satisfies ProfileVanityGetResponse)
        } catch (err: any) {
            res.status(500).json({
                success: false,
                data: { destinyMembershipId, destinyMembershipType },
                error: err.message
            } satisfies ProfileVanityGetResponse)
        }
    } catch (e) {
        return res.status(400).json({
            data: req.query,
            success: false,
            error: "Bad request"
        } satisfies ProfileVanityGetResponse)
    }
}
