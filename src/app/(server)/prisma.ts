import "server-only"

import { createClient } from "@libsql/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { PrismaClient } from "@prisma/client"

export type PrismaClientWithExtensions = ReturnType<typeof createPrismaWithExtension>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientWithExtensions | undefined
}

const createPrismaWithExtension = () =>
    new PrismaClient({
        log: process.env.APP_ENV === "local" ? ["query", "error", "warn"] : ["error"],
        adapter: new PrismaLibSQL(
            createClient(
                process.env.APP_ENV === "local"
                    ? { url: "file:./prisma/raidhub-sqlite.db" }
                    : {
                          url: process.env.TURSO_DATABASE_URL!,
                          authToken: process.env.TURSO_AUTH_TOKEN
                      }
            )
        )
    }).$extends({
        name: "roleEnum",
        result: {
            user: {
                role: {
                    needs: {
                        role_: true
                    },
                    compute: data => data.role_ as "USER" | "ADMIN"
                }
            }
        }
    })

export const prisma = globalForPrisma.prisma ?? createPrismaWithExtension()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
