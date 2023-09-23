import styles from "~/styles/pages/account.module.css"
import { ChangeEventHandler, useState } from "react"
import Image from "next/image"
import { SessionUser } from "~/server/next-auth/sessionCallback"
import { uploadProfileIcon } from "~/services/s3/uploadProfileIcon"
import { useOptimisticProfileUpdate } from "~/hooks/raidhub/useOptimisticProfileUpdate"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useLocale } from "../app/LocaleManager"
import { trpc } from "~/util/trpc"

type FormValues = {
    username: string
    image: File
}

const IconUploadForm = ({
    user,
    refreshSession
}: {
    user: SessionUser
    refreshSession(): void
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [fileType, setFileType] = useState<string | null>(null)
    const [err, setErr] = useState<Error | null>(null)
    const { mutate: optimisticProfileUpdate, isLoading } = useOptimisticProfileUpdate({
        onSuccess() {
            refreshSession()
        }
    })

    const { data: signedUrl } = trpc.user.account.s3SignedUrl.useQuery(
        { fileType: fileType ?? "image/png" },
        {
            enabled: !!imageSrc && !!fileType,
            refetchInterval: 55_000,
            refetchOnWindowFocus: true
        }
    )

    const { handleSubmit, control, setValue, resetField } = useForm<FormValues>({
        defaultValues: {
            username: user.name
        }
    })

    const onSubmit: SubmitHandler<FormValues> = async data => {
        try {
            if (data.image) {
                if (!signedUrl) {
                    setErr(new Error("Please try again"))
                    return
                }

                const successfulUpload = await uploadProfileIcon({
                    file: data.image,
                    signedURL: signedUrl
                })
                if (!successfulUpload) {
                    setErr(new Error("Failed to upload Image"))
                    return
                }
                const url = new URL(signedUrl)

                optimisticProfileUpdate({
                    name: data.username,
                    image: url.origin + url.pathname
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
                setFileType(null)
                return
            }
            setValue("image", file)
            setImageSrc(URL.createObjectURL(file))
            setFileType(file.type)
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
            <button type="submit" disabled={isLoading || (!!imageSrc && !signedUrl)}>
                {strings.save}
            </button>
        </form>
    )
}

export default IconUploadForm
