import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useLocale } from "../app/LocaleManager"
import { trpc } from "~/util/trpc"
import { z } from "zod"
import { zCreateVanity } from "~/util/zod"
import styles from "~/styles/pages/admin.module.css"

type FormValues = z.infer<typeof zCreateVanity>

let membershipTypes = [
    { label: "1 - Xbox", value: 1 },
    { label: "2 - PS", value: 2 },
    { label: "3 - Steam", value: 3 },
    { label: "5 - Stadia", value: 5 },
    { label: "6 - Epic", value: 6 }
]

const AddVanityForm = () => {
    const {
        mutate: create,
        isLoading: isCreating,
        isSuccess,
        isError,
        error
    } = trpc.admin.vanity.create.useMutation()

    const onSubmit: SubmitHandler<FormValues> = async data => {
        create(data)
    }
    const { strings } = useLocale()

    const { handleSubmit, control, setValue, resetField } = useForm<FormValues>()

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Create vanity</h3>
            <div className={styles["form-content"]}>
                <div className={styles["form-element"]}>
                    <label>Destiny Membership ID</label>
                    <Controller
                        name="destinyMembershipId"
                        control={control}
                        render={({ field }) => <input {...field} />}
                    />
                </div>
                <div className={styles["form-element"]}>
                    <label>Destiny Membership Type</label>
                    <Controller
                        name="destinyMembershipType"
                        control={control}
                        render={({ field }) => <input {...field} />}
                        rules={{ required: true }}
                    />
                </div>
                <div className={styles["form-element"]}>
                    <label>Vanity String</label>
                    <Controller
                        name="string"
                        control={control}
                        render={({ field }) => <input {...field} />}
                    />
                </div>
            </div>
            <button type="submit" disabled={isCreating}>
                {strings.submit}
            </button>
            {isSuccess && <div style={{ color: "green" }}>Success</div>}
            {isError && <div style={{ color: "red" }}>Error {<span>{error.message}</span>}</div>}
        </form>
    )
}

export default AddVanityForm
