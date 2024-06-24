import { type inferRouterOutputs } from "@trpc/server"
import { type AppRouter } from "~/server/api/trpc"

export type RouterOutput = inferRouterOutputs<AppRouter>

export type AppProfile = RouterOutput["profile"]["getUnique"]
export type AppUserUpdate = RouterOutput["user"]["update"]
export type AppRole = "ADMIN" | "USER"
