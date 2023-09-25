import type { PresignedPost } from "@aws-sdk/s3-presigned-post"

export const uploadProfileIcon = async (file: File, signedURL: PresignedPost) => {
    const formData = new FormData()
    Object.entries(signedURL.fields).map(([key, value]) => {
        formData.append(key, value)
    })
    formData.append("file", file)

    const res = await fetch(signedURL.url, {
        method: "POST",
        body: formData
    })

    return res.ok
}
