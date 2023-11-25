// @ts-nocheck
import { createRequire } from "node:module"
import { PrismaClient } from "@prisma/client"
import { PrismaPlanetScale } from "@prisma/adapter-planetscale"
import { fetch as undiciFetch } from "undici"

let prisma: PrismaClient

function createPscaleClient() {
    const require = createRequire(import.meta.url)
    const { Client: PlanetScaleClient } = require("@planetscale/database")
    const client = new PlanetScaleClient({ url: process.env.DATABASE_URL, fetch: undiciFetch })
    const adapter = new PrismaPlanetScale(client)
    return new PrismaClient({ adapter })
}
if (process.env.NODE_ENV === "production") {
    prisma = process.env.APP_ENV !== "local" ? createPscaleClient() : new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma
}

export default prisma
