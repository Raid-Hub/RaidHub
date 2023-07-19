import { S3 } from "aws-sdk"
import { protectSession } from "../../../../util/server/sessionProtection"
import { NextApiHandler, NextApiRequest } from "next"
import { ApiRequest, UserImageCreateResponse } from "../../../../types/api"
import { userId } from "../[userId]"
import PersistentFile from "formidable/PersistentFile"
import formidable, { File } from "formidable"
import fs from "fs"

const s3 = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
})

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "POST") {
        const _userId = userId(req)
        const validSession = await protectSession({
            req: req as ApiRequest<"POST">,
            res,
            userId: _userId
        })
        if (_userId && validSession) {
            return await uploadImageToS3(req, _userId)
                .then(imageUrl =>
                    res.status(201).json({
                        success: true,
                        error: undefined,
                        data: {
                            imageUrl
                        }
                    } satisfies UserImageCreateResponse)
                )
                .catch(err =>
                    res.status(500).json({
                        success: false,
                        error: "Failed to upload image to AWS S3",
                        data: err
                    } satisfies UserImageCreateResponse)
                )
        } else {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
                data: null
            } satisfies UserImageCreateResponse)
        }
    } else {
        res.status(405).json({
            success: false,
            error: "Method not allowed",
            data: null
        } satisfies UserImageCreateResponse)
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler

async function uploadImageToS3(req: NextApiRequest, id: string) {
    return new Promise<string>((resolve, reject) =>
        formidable().parse(req, async (error, _, files) => {
            if (error) {
                return reject(error)
            } else {
                // @ts-ignore
                const file: File = files.file[0]
                const fileNameParts = file.originalFilename!.split(".")
                return s3
                    .upload({
                        Bucket: process.env.AWS_S3_BUCKET_NAME!,
                        Key: id + "." + fileNameParts[fileNameParts?.length - 1],
                        ContentType: file.mimetype!,
                        Body: fs.createReadStream(file.filepath)
                    })
                    .promise()
                    .then(res => resolve(res.Location))
                    .catch(reject)
            }
        })
    )
}
