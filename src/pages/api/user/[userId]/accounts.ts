import { NextApiHandler } from "next"
import { BadMethodResponse, UserAccountDeleteResponse } from "../../../../types/api"
import { protectSession } from "../../../../util/server/sessionProtection"
import prisma from "../../../../util/server/prisma"
import { providerIdToUsernamePropMap } from "../../../../util/server/auth/providerIdMap"
import { z } from "zod"

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "DELETE") {
        await handleDelete(req, res)
    } else {
        res.status(405).json({
            data: { method: req.method! },
            success: false,
            error: "Method not allowed"
        } satisfies BadMethodResponse)
    }
}

const handleDelete: NextApiHandler = protectSession(async (req, res, userId) => {
    try {
        const { providerId } = z
            .object({
                providerId: z.string()
            })
            .parse(req.query)

        try {
            const { accounts } = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    [providerIdToUsernamePropMap[providerId]]: null
                },
                include: {
                    accounts: {
                        select: {
                            provider: true
                        }
                    }
                }
            })

            if (accounts.find(a => a.provider === providerId)) {
                await prisma.account
                    .delete({
                        where: {
                            provider_userId: {
                                provider: providerId,
                                userId: userId
                            }
                        }
                    })
                    .then(deleted => {
                        res.status(200).json({
                            success: true,
                            error: undefined,
                            data: {
                                message: `Successfully removed ${providerId} account.`
                            }
                        } satisfies UserAccountDeleteResponse)
                    })
            } else {
                res.status(404).json({
                    success: false,
                    error: "No account to unlink",
                    data: {
                        accounts
                    }
                } satisfies UserAccountDeleteResponse)
            }
        } catch (e: any) {
            res.status(500).json({
                success: false,
                error: e.message,
                data: e
            } satisfies UserAccountDeleteResponse)
        }
    } catch {
        res.status(400).json({
            success: false,
            error: "Invalid provider id provided",
            data: {
                providerId: req.query.providerId
            }
        } satisfies UserAccountDeleteResponse)
    }
})

export default handler
