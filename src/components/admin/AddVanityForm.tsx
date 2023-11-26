import { SubmitHandler, useForm } from "react-hook-form"
import { useLocale } from "../app/LocaleManager"
import { trpc } from "~/util/trpc"
import { z } from "zod"
import { zCreateVanity } from "~/util/zod"
import styles from "~/styles/pages/admin.module.css"
import Link from "next/link"

type FormValues = z.infer<typeof zCreateVanity>

const AddVanityForm = () => {
    const {
        mutate: create,
        isLoading: isCreating,
        isSuccess,
        isError,
        error,
        data
    } = trpc.admin.vanity.create.useMutation()

    const onSubmit: SubmitHandler<FormValues> = async data => {
        create(data)
    }
    const { strings } = useLocale()

    const { handleSubmit, control, register } = useForm<FormValues>()

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Create vanity</h3>
            <div className={styles["form-content"]}>
                <div className={styles["form-element"]}>
                    <label>Destiny Membership ID</label>
                    <input type="text" {...register("destinyMembershipId")} />
                </div>
                <div className={styles["form-element"]}>
                    <label>Destiny Membership Type</label>
                    <input
                        type="number"
                        {...register("destinyMembershipType", {
                            valueAsNumber: true
                        })}
                    />
                </div>
                <div className={styles["form-element"]}>
                    <label>Vanity String</label>
                    <input type="text" {...register("string")} />
                </div>
            </div>
            <button type="submit" disabled={isCreating}>
                {strings.submit}
            </button>
            {isSuccess && (
                <div style={{ color: "green" }}>
                    Success: <Link href={`/${data.vanity}`}>/{data.vanity}</Link>
                </div>
            )}
            {isError && <div style={{ color: "red" }}>Error {<span>{error.message}</span>}</div>}
        </form>
    )
}

export default AddVanityForm
