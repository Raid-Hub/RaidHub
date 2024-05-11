import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "~/server/prisma"
import { SubmitButton } from "./SubmitButton"

const zCreateVanity = z.object({
    destinyMembershipId: z.string(),
    string: z.string().transform(s => s.toLowerCase())
})

export const AddVanityForm = () => {
    const action = async (data: FormData) => {
        "use server"

        const input = zCreateVanity.parse(Object.fromEntries(data.entries()))

        const vanity = await prisma.profile.update({
            where: {
                destinyMembershipId: input.destinyMembershipId
            },
            data: {
                vanity: input.string
            },
            select: {
                vanity: true
            }
        })

        revalidatePath(`/profile/${input.destinyMembershipId}`)
        revalidatePath(`/user/${vanity.vanity}`)
    }

    return (
        <form action={action}>
            <h3>Create vanity</h3>
            <div>
                <div>
                    <label>Destiny Membership ID</label>
                    <input type="text" id="destinyMembershipId" name="destinyMembershipId" />
                </div>
                <div>
                    <label>Vanity String</label>
                    <input type="text" id="string" name="string" />
                </div>
            </div>
            <SubmitButton title="create" />
        </form>
    )
}
