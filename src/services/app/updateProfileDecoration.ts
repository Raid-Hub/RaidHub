import { User } from "@prisma/client"
import { updateCurrentUser } from "./updateCurrentUser"

type UpdateProfileDecoration = ({ decoration }: { decoration: string }) => Promise<{
    updated: Partial<User>
}>
export const updateProfileDecoration: UpdateProfileDecoration = async ({ decoration }) => {
    return updateCurrentUser({
        profile_decoration: decoration
    })
}
