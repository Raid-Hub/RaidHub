import { updateCurrentUser } from "../../services/app/uploadProfileIcon"
import { useForm } from "react-hook-form"
import { User } from "@prisma/client"
import { SessionUser } from "../../util/server/auth/sessionCallback"
import { zodResolver } from "@hookform/resolvers/zod"
import { zUser } from "../../util/zod"

type UpdateUserInfoProps = {
    user: SessionUser
    refreshSession(): void
}

type FormInputs = Pick<User, "name">

const UpdateUserInfo = ({ user, refreshSession }: UpdateUserInfoProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: {
            name: user.name
        },
        resolver: zodResolver(zUser.partial())
    })

    const onSubmit = (values: FormInputs) => {
        updateCurrentUser(values).then(refreshSession).catch(console.error)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Change Username</label>
            <input {...register("name", { required: true })} />

            <input type="submit" />
            {errors && <span>{errors.name?.message}</span>}
        </form>
    )
}

export default UpdateUserInfo
