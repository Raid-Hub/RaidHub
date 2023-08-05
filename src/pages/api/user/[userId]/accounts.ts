import { NextApiHandler } from "next"
import {
    ApiHandler,
    ApiRequest,
    BadMethodResponse,
    UserAccountDeleteResponse
} from "../../../../types/api"
import { protectSession } from "../../../../util/server/sessionProtection"
import { getUserId } from "../[userId]"
import prisma from "../../../../util/server/prisma"
import { providerIdToUsernamePropMap } from "../../../../util/server/auth/providerIdMap"

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "DELETE") {
        await handleDelete(req as ApiRequest<"DELETE">, res)
    } else {
        res.status(405).json({
            data: { method: req.method! },
            success: false,
            error: "Method not allowed"
        } satisfies BadMethodResponse)
    }
}

const handleDelete: ApiHandler<"DELETE"> = async (req, res) => {
    const userId = getUserId(req)
    const validSession = await protectSession({
        req,
        res,
        userId
    })
    if (!userId || !validSession) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
            data: null
        } satisfies UserAccountDeleteResponse)
    }

    const { providerId } = req.query
    if (!providerId || Array.isArray(providerId)) {
        return res.status(400).json({
            success: false,
            error: "Invalid provider id provided",
            data: {
                providerId: providerId
            }
        } satisfies UserAccountDeleteResponse)
    }

    const { accounts } = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            [providerIdToUsernamePropMap[providerId]]: null
        },
        select: {
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
}

export default handler
