import "server-only"

import { Client as PlanetScaleClient } from "@planetscale/database"
import { PrismaPlanetScale } from "@prisma/adapter-planetscale"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.APP_ENV === "local" ? ["query", "error", "warn"] : ["error"],
        adapter:
            process.env.APP_ENV === "local"
                ? null
                : new PrismaPlanetScale(new PlanetScaleClient({ url: process.env.DATABASE_URL }))
    })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
