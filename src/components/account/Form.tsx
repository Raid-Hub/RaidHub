import styles from "~/styles/pages/account.module.css"
import { ChangeEventHandler, useState } from "react"
import Image from "next/image"
import { SessionUser } from "~/server/next-auth/sessionCallback"
import { uploadProfileIcon } from "~/services/app/uploadProfileIcon"
import { useOptimisticProfileUpdate } from "~/hooks/raidhub/useOptimisticProfileUpdate"
import { useMutation } from "@tanstack/react-query"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useLocale } from "../app/LocaleManager"

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
    const { mutate: uploadIcon } = useMutation(uploadProfileIcon, {
        onSuccess({ imageUrl }) {
            optimisticProfileUpdate({ image: imageUrl })
        }
    })

    const { handleSubmit, control, setValue } = useForm<FormValues>({
        defaultValues: {
            username: user.name
        }
    })

    const onSubmit: SubmitHandler<FormValues> = data => {
        console.log(data)

        optimisticProfileUpdate({ name: data.username })
        if (data.image) {
            uploadIcon({ file: data.image })
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
            <button type="submit">{strings.save}</button>
        </form>
    )
}

export default IconUploadForm
