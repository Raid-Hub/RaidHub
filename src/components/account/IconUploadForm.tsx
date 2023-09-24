import styles from "~/styles/pages/account.module.css"
import { ChangeEventHandler, useState } from "react"
import Image from "next/image"
import { SessionUser } from "~/server/next-auth/sessionCallback"
import { uploadProfileIcon } from "~/services/s3/uploadProfileIcon"
import { useOptimisticProfileUpdate } from "~/hooks/raidhub/useOptimisticProfileUpdate"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useLocale } from "../app/LocaleManager"
import { trpc } from "~/util/trpc"
import { useSession } from "next-auth/react"

type FormValues = {
    username: string
    image: File
}

const IconUploadForm = ({ user }: { user: SessionUser }) => {
    const { update: updateSession } = useSession()
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const { mutateAsync: createPresignedURL } = trpc.user.account.profileIcon.useMutation()
    const [err, setErr] = useState<Error | null>(null)
    const { mutate: optimisticProfileUpdate, isLoading } = useOptimisticProfileUpdate({
        onSuccess: () => updateSession()
    })

    const { handleSubmit, control, setValue, resetField } = useForm<FormValues>({
        defaultValues: {
            username: user.name
        }
    })

    const onSubmit: SubmitHandler<FormValues> = async data => {
        try {
            if (data.image) {
                const fileType = data.image.type
                if (!fileType) {
                    setErr(new Error("Please try again"))
                    return
                }
                const signedURL = await createPresignedURL({ fileType: fileType })

                const successfulUpload = await uploadProfileIcon({
                    file: data.image,
                    signedURL: signedURL
                })

                if (!successfulUpload) {
                    setErr(new Error("Failed to upload Image"))
                    return
                }

                optimisticProfileUpdate({
                    name: data.username,
                    image: signedURL.url + signedURL.fields.key
                })
            } else {
                optimisticProfileUpdate({ name: data.username })
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

    const { strings } = useLocale()

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={[styles["form"], styles["glossy-bg"]].join(" ")}>
            <div className={styles["form-element"]}>
                <div>
                    <label>Display Name: </label>
                    <Controller
                        name="username"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input {...field} />}
                    />
                </div>
            </div>
            <div className={styles["form-element"]}>
                {imageSrc && <Image src={imageSrc} alt="selected icon" width={50} height={50} />}
                <div>
                    <label>Icon: </label>{" "}
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>
            {err && <div style={{ color: "red" }}>{err.message}</div>}
            <button type="submit" disabled={isLoading}>
                {strings.save}
            </button>
        </form>
    )
}

export default IconUploadForm
