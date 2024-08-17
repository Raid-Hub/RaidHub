import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { TRPCError } from "@trpc/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { adminProcedure } from "../.."

export const removeVanity = adminProcedure
    .input(
        z.object({
            vanity: z.string().transform(s => s.toLowerCase())
        })
    )
    .mutation(async ({ ctx, input }) => {
        try {
            await ctx.prisma.profile.findUniqueOrThrow({
                where: {
                    vanity: input.vanity
                }
            })
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
                throw new TRPCError({
                    message: err.message,
                    code: "BAD_REQUEST"
                })
            } else {
                throw err
            }
        }

        const updated = await ctx.prisma.profile.update({
            where: {
                vanity: input.vanity
            },
            data: {
                vanity: null
            },
            select: {
                destinyMembershipId: true,
                user: {
                    select: {
                        name: true
                    }
                }
            }
        })

        revalidatePath(`/profile/${updated.destinyMembershipId}`)
        revalidatePath(`/user/${input.vanity}`)
        revalidateTag("vanity")

        return updated
    })
