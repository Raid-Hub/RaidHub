import AppError from "~/models/errors/AppError"

type UploadProfileIconResponse =
    | {
          data: any
          success: false
          error: "string"
      }
    | {
          data: {
              imageUrl: string
          }
          success: true
          error: string
      }

export const uploadProfileIcon = async ({ file }: { file: File }) => {
    const formData = new FormData()
    formData.append("file", file)

    const fetchOptions = {
        method: "PUT",
        body: formData
    }

    const res = await fetch(`/api/icon/upload`, fetchOptions)
    const responseJson = (await res.json()) as UploadProfileIconResponse
    if (!res.ok || responseJson.success === false) {
        if (responseJson.success === false) {
            throw new AppError(responseJson.error, responseJson.data)
        } else {
            throw new Error("Invalid server response")
        }
    }

    return responseJson.data
}
