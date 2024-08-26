import { createTRPCReact } from "@trpc/react-query"
import { type AppRouter } from "~/server/api/trpc"

export const trpc = createTRPCReact<AppRouter>()
