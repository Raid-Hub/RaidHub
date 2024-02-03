import { Client } from "@planetscale/database"
import { PrismaPlanetScale } from "@prisma/adapter-planetscale"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const client = new Client({ url: process.env.DATABASE_URL })

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        adapter: new PrismaPlanetScale(client)
    })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
