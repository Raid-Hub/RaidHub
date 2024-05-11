import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "~/server/prisma"
import { SubmitButton } from "./SubmitButton"

const zDeleteVanity = z.object({
    vanity: z.string().toLowerCase()
})

export const RemoveVanityForm = () => {
    const action = async (data: FormData) => {
        "use server"

        const input = zDeleteVanity.parse(Object.fromEntries(data.entries()))

        const removed = await prisma.profile.update({
            where: {
                vanity: input.vanity
            },
            data: {
                vanity: null
            },
            select: {
                destinyMembershipId: true,
                name: true
            }
        })
        revalidatePath(`/profile/${removed.destinyMembershipId}`)
        revalidatePath(`/user/${input.vanity}`)
    }

    return (
        <form action={action}>
            <h3>Delete vanity</h3>
            <div>
                <div>
                    <label>Vanity String</label>
                    <input type="text" id="vanity" name="vanity" />
                </div>
            </div>
            <SubmitButton title="delete" />
        </form>
    )
}
