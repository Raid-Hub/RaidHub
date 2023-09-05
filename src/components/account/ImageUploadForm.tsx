import { ChangeEventHandler, FormEventHandler, useState } from "react"
import { SessionUser } from "../../util/server/auth/sessionCallback"
import Image from "next/image"
import { UserImageCreateResponse } from "../../types/api"

const ImageUploadForm = ({
    user,
    refreshSession
}: {
    user: SessionUser
    refreshSession(): void
}) => {
    const [image, setImage] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = event => {
        setSelectedFile(event.target.files?.[0] ?? null)
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
        event.preventDefault()

        if (selectedFile) {
            const formData = new FormData()
            formData.append("file", selectedFile)

            try {
                const response = await fetch(`/api/user/${user.id}/image`, {
                    method: "PUT",
                    body: formData
                })

                if (response.ok) {
                    const res = (await response.json()) as UserImageCreateResponse

                    if (res.success) {
                        console.log("Image uploaded:", res.data)
                        setImage(res.data.imageUrl)
                        refreshSession()
                    }
                } else {
                    console.error("Upload failed:", response.statusText)
                }
            } catch (error) {
                console.error("Error:", error)
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Upload</button>
            </form>
            {image && (
                <Image src={image} width={50} height={50} unoptimized alt={"profile-picture"} />
            )}
        </div>
    )
}

export default ImageUploadForm
