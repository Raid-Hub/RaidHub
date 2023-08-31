import { NextApiHandler, NextApiRequest } from "next"
import { BadMethodResponse, ProfileGetResponse } from "@/types/api"
import prisma from "@/util/server/prisma"

const getDestinyMembershipId = (req: NextApiRequest): string | undefined =>
    req.url?.split("/")[3]?.toString()

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
    const destinyMembershipId = getDestinyMembershipId(req)
    if (!destinyMembershipId) {
        return res.status(400).json({
            data: { destinyMembershipId },
            success: false,
            error: "Bad request"
        } satisfies ProfileGetResponse)
    }

    try {
        // fetch the public user profile
        const profile = await prisma.user.findUnique({
            where: {
                destinyMembershipId
            },
            select: {
                name: true,
                destinyMembershipId: true,
                destinyMembershipType: true,
                bungieUsername: true,
                discordUsername: true,
                twitchUsername: true,
                twitterUsername: true,
                image: true,
                vanity: true,
                profile: true
            }
        })

        res.status(200).json({
            data: profile,
            success: true,
            error: undefined
        } satisfies ProfileGetResponse)
    } catch (err: any) {
        res.status(500).json({
            success: false,
            data: { destinyMembershipId },
            error: err.message
        } satisfies ProfileGetResponse)
    }
}
