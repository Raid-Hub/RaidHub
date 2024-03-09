import "server-only"

import { createClient } from "@libsql/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
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
                : new PrismaLibSQL(
                      createClient({
                          url: process.env.TURSO_DATABASE_URL!,
                          authToken: process.env.TURSO_AUTH_TOKEN
                      })
                  )
    })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
