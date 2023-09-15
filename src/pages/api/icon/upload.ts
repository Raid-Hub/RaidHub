import { S3 } from "aws-sdk"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import fs from "fs"
import { IncomingForm } from "formidable"
import path, { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { getServerSession } from "next-auth"
import { nextAuthOptions } from "~/server/next-auth"

const s3 = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
})

export const config = {
    api: {
        bodyParser: false
    }
}

const supportedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

type Handler<T = any> = (req: NextApiRequest, res: NextApiResponse<T>, userId: string) => unknown
const protectedRoute =
    (handler: Handler): NextApiHandler =>
    async (req, res) => {
        const session = await getServerSession(req, res, nextAuthOptions)

        if (!session?.user.id) {
            return res.status(401).json({ error: "Unauthorized request" })
        }

        return handler(req, res, session.user.id)
    }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return protectedRoute(async (req, res, userId) => {
            return uploadImage(req, userId)
                .then(url =>
                    res.status(201).json({
                        success: true,
                        error: undefined,
                        data: {
                            imageUrl: url!
                        }
                    })
                )
                .catch(err =>
                    res.status(500).json({
                        success: false,
                        error: "Failed to edit profile picture",
                        data: err
                    })
                )
        })(req, res)
    } else {
        return res.status(405).json({
            data: { method: req.method! },
            success: false,
            error: "Method not allowed"
        })
    }
}

async function uploadImage(req: NextApiRequest, userId: string) {
    return new Promise<string>((resolve, reject) => {
        const form = new IncomingForm({
            maxFiles: 1,
            maxFileSize: 0.5 * 1024 * 1024 // 0.5 mb
        })
        form.parse(req, async (error, _, { file: files }) => {
            if (error) {
                if (error.code === 1009) {
                    return reject(new Error("Image too large"))
                } else {
                    console.error(error)
                    return reject(error)
                }
            }
            try {
                const file = Array.isArray(files) ? files[0] : files
                if (supportedFileTypes.includes(file.mimetype!)) {
                    let url: Promise<string>
                    switch (process.env.APP_ENV) {
                        case "production":
                        case "staging":
                        case "preview":
                            url = uploadToS3({
                                file,
                                userId
                            })
                            break
                        default:
                            url = saveLocally({
                                file,
                                userId
                            })
                    }
                    return await url.then(resolve).catch(reject)
                } else {
                    reject("Unsupported file type: " + file.mimetype)
                }
            } catch (e) {
                reject(e)
            }
        })
    })
}

async function uploadToS3({ file, userId }: { file: formidable.File; userId: string }) {
    const uuid = uuidv4()
    const newLocation = await s3
        .upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: `profile/${userId}/${uuid}.png`,
            ContentType: file.mimetype!,
            Body: fs.createReadStream(file.filepath),
            Expires:
                process.env.APP_ENV === "preview"
                    ? new Date(Date.now() + 30 * 24 * 3600 * 1000)
                    : undefined
        })
        .promise()
        .then(res => res.Location)

    s3.listObjectsV2({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Prefix: `profile/${userId}/`
    })
        .promise()
        .then(data => {
            const Objects =
                (data.Contents?.filter(({ Key }) => !Key?.includes(uuid)).map(({ Key }) => ({
                    Key
                })) as {
                    Key: string
                }[]) ?? []

            if (Objects.length === 0) {
                return
            }

            s3.deleteObjects({
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Delete: {
                    Objects
                }
            }).promise()
        })
    return newLocation
}

// this is only used in local dev environments
async function saveLocally({ file, userId }: { file: formidable.File; userId: string }) {
    const uuid = uuidv4()
    const uploadFolder = path.join(__dirname, "../../../../../public")
    const fileName = `/profile-${userId}-${uuid}-icon.png`
    const destination = join(uploadFolder, fileName)

    const filePath = await new Promise<string>((resolve, reject) => {
        fs.rename(file.filepath, destination, err => {
            if (err) {
                reject(err)
            } else {
                resolve(fileName)
            }
        })
    })

    fs.readdir(uploadFolder, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err)
            return
        }

        files.forEach(file => {
            if (file.includes(`profile-${userId}-`) && !file.includes(uuid)) {
                const fileToDelete = path.join(uploadFolder, file)
                fs.unlink(fileToDelete, err => {
                    if (err) {
                        console.error("Error deleting file:", fileToDelete, err)
                    } else {
                        console.log("Deleted file:", fileToDelete)
                    }
                })
            }
        })
    })

    return filePath
}
