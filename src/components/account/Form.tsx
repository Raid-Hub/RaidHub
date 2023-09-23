import styles from "~/styles/pages/account.module.css"
import { ChangeEventHandler, useState } from "react"
import Image from "next/image"
import { SessionUser } from "~/server/next-auth/sessionCallback"
import { uploadProfileIcon } from "~/services/app/uploadProfileIcon"
import { useOptimisticProfileUpdate } from "~/hooks/raidhub/useOptimisticProfileUpdate"
import { useMutation } from "@tanstack/react-query"
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
    const { mutate: optimisticProfileUpdate } = useOptimisticProfileUpdate({
        onSuccess() {
            refreshSession()
        }
    })
    const imgSrcParts = imageSrc?.split(".")
    const extension = imgSrcParts ? imgSrcParts[imgSrcParts.length - 1] : ""
    const { data: signedUrl } = trpc.user.account.s3SignedUrl.useQuery(
        { fileExtension: extension },
        {
            enabled: !!imageSrc,
            refetchInterval: 55_000,
            refetchOnWindowFocus: true
        }
    )

    const { handleSubmit, control, setValue } = useForm<FormValues>({
        defaultValues: {
            username: user.name
        }
    })

    const onSubmit: SubmitHandler<FormValues> = async data => {
        try {
            if (data.image) {
                if (!signedUrl) {
                    throw new Error("No signed URL")
                }
                const res = await uploadProfileIcon({ file: data.image, signedURL: signedUrl })
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
            <button type="submit" disabled={!!imageSrc && !signedUrl}>
                {strings.save}
            </button>
        </form>
    )
}

export default IconUploadForm
