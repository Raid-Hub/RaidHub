import { PrismaClient } from "@prisma/client"
import { Client as PlanetScaleClient } from "@planetscale/database"
import { PrismaPlanetScale as PrismaPlanetScaleAdapter } from "@prisma/adapter-planetscale"
import { fetch as undiciFetch } from "undici"

declare global {
    var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
    prisma = process.env.APP_ENV === "local" ? createLocalClient() : createPscaleClient()
} else {
    if (!global.prisma) {
        global.prisma = createLocalClient()
    }
    prisma = global.prisma
}

export default prisma

function createLocalClient() {
    return new PrismaClient()
}

function createPscaleClient() {
    const client = new PlanetScaleClient({ url: process.env.DATABASE_URL, fetch: undiciFetch })
    const adapter = new PrismaPlanetScaleAdapter(client)
    return new PrismaClient({ adapter })
}
