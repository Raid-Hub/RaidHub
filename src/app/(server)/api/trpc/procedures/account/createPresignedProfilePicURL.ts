import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { TRPCError } from "@trpc/server"
import { v4 } from "uuid"
import { z } from "zod"
import { protectedProcedure } from "../.."

const s3 = new S3Client({
    region: process.env.AWS_S3_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!
    }
})

export const createPresignedProfilePicURL = protectedProcedure
    .input(
        z.object({
            fileType: z.string()
        })
    )
    .mutation(async ({ input, ctx }) => {
        const userId = ctx.session.user.id

        const ext = input.fileType.includes("svg+xml") ? "svg" : input.fileType.split("/")[1]

        try {
            const uuid = v4()
            return createPresignedPost(s3, {
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: `profile/${userId}/${uuid}.${ext}`,
                Expires: 30,
                Conditions: [["content-length-range", 0, 102400]]
            })
        } catch (e: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            })
        }
    })
