import AppError from "~/models/errors/AppError"

export const uploadProfileIcon = async ({ file, signedURL }: { file: File; signedURL: string }) => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(signedURL, {
        method: "PUT",
        body: formData
    })

    const responseJson = await res.json()

    console.log(responseJson)

    return responseJson
}
