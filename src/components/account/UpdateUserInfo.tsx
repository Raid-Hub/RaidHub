import { updateCurrentUser } from "../../services/app/updateCurrentUser"
import { useForm } from "react-hook-form"
import { User } from "@prisma/client"
import { SessionUser } from "../../util/server/auth/sessionCallback"
import { zodResolver } from "@hookform/resolvers/zod"
import { zUser } from "../../util/server/zod"

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
        resolver: zodResolver(zUser)
    })

    const onSubmit = (values: FormInputs) => {
        console.log(values)
        updateCurrentUser(values).then(refreshSession)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Change Username</label>
            <input {...register("name", { required: true })} />

            <input type="submit" />
        </form>
    )
}

export default UpdateUserInfo
