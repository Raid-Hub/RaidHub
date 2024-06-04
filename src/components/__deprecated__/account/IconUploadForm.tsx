"use client"

import Image from "next/image"
import { useState, type ChangeEventHandler } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { trpc } from "~/app/trpc"
import { useOptimisticProfileUpdate } from "~/hooks/app/useOptimisticProfileUpdate"
import { useSession } from "~/hooks/app/useSession"
import { uploadProfileIcon } from "~/services/s3/uploadProfileIcon"
import styles from "./account.module.css"

type FormValues = {
    image: File
}

const IconUploadForm = () => {
    const { data: session, update: updateSession } = useSession()
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [err, setErr] = useState<Error | null>(null)
    const { mutateAsync: createPresignedURL } = trpc.user.account.presignedIconURL.useMutation()
    const { mutate: optimisticProfileUpdate, isLoading } = useOptimisticProfileUpdate({
        onSuccess: () => {
            void updateSession()
            alert("Icon updated")
        }
    })

    const { handleSubmit, setValue, resetField } = useForm<FormValues>({
        defaultValues: {}
    })

    const onSubmit: SubmitHandler<FormValues> = async data => {
        try {
            if (data && session?.user.primaryDestinyMembershipId) {
                const fileType = data.image.type
                if (!fileType) {
                    setErr(new Error("Please try again"))
                    return
                }

                const signedURL = await createPresignedURL({ fileType: fileType })

                const successfulUpload = await uploadProfileIcon(data.image, signedURL)
                if (!successfulUpload) {
                    setErr(new Error("Failed to upload Image"))
                    return
                }

                const newIconUrl = signedURL.url + signedURL.fields.key

                optimisticProfileUpdate({
                    data: {
                        image: newIconUrl
                    },
                    destinyMembershipId: session.user.primaryDestinyMembershipId
                })
            } else {
                setErr(new Error("Please try again"))
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = event => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > 102400 /** 100 KB */) {
                setErr(new Error("File too large. Max: 100kb"))
                resetField("image")
                setImageSrc(null)
                return
            }
            setValue("image", file)
            setImageSrc(URL.createObjectURL(file))
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={[styles.form, styles["glossy-bg"]].join(" ")}>
            <div className={styles["form-element"]}>
                {imageSrc && <Image src={imageSrc} alt="selected icon" width={50} height={50} />}
                <div>
                    <label>Icon: </label>{" "}
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>
            {err && <div style={{ color: "red" }}>{err.message}</div>}
            <button type="submit" disabled={isLoading}>
                Save
            </button>
        </form>
    )
}

export default IconUploadForm
