import { ChangeEventHandler, FormEventHandler, useState } from "react"
import Image from "next/image"
import { SessionUser } from "~/server/next-auth/sessionCallback"
import { uploadProfileIcon } from "~/services/app/uploadProfileIcon"
import { useOptimisticProfileUpdate } from "~/hooks/raidhub/useOptimisticProfileUpdate"

const ImageUploadForm = ({
    user,
    refreshSession
}: {
    user: SessionUser
    refreshSession(): void
}) => {
    const [image, setImage] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const { mutate } = useOptimisticProfileUpdate()

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = event => {
        setSelectedFile(event.target.files?.[0] ?? null)
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
        event.preventDefault()

        if (selectedFile) {
            try {
                uploadProfileIcon({ file: selectedFile }).then(res => {
                    mutate({ image: res.imageUrl })
                })
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
