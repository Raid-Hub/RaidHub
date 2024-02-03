import { SubmitHandler, useForm } from "react-hook-form"
import { trpc } from "~/util/trpc"
import { z } from "zod"
import { zCreateVanity } from "~/util/zod"
import styles from "~/styles/pages/admin.module.css"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"

type FormValues = z.infer<typeof zCreateVanity>

export default function AddVanityForm() {
    const {
        mutate: create,
        isLoading: isCreating,
        isSuccess,
        isError,
        error,
        data
    } = trpc.admin.vanity.create.useMutation()

    const { handleSubmit, register } = useForm<FormValues>({
        resolver: zodResolver(zCreateVanity)
    })

    const onSubmit: SubmitHandler<FormValues> = async data => {
        create(data)
    }

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
                Submit
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
