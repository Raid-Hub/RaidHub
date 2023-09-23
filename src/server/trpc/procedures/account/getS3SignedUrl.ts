import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../middleware"
import { S3 } from "aws-sdk"
import { v4 } from "uuid"
import { z } from "zod"

const s3 = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    // region: "us-east-1",
    signatureVersion: "v4"
})

// delete account from user
export const getS3SignedUrl = protectedProcedure
    .input(
        z.object({
            fileExtension: z.string()
        })
    )
    .query(async ({ input, ctx }) => {
        const userId = ctx.session.user.id

        try {
            const uuid = v4()
            const url = await s3.getSignedUrlPromise("putObject", {
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: `profile/${userId}/${uuid}.png`,
                Expires: 60,
                ContentType: `image/${input.fileExtension}`
            })
            return url
        } catch (e: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            })
        }
    })
