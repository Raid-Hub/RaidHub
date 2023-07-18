import { PrismaClient, User } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/lib/models"

const prisma = new PrismaClient()

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

async function main() {
    // create fake users
    await seedFakeUsers()
    await addStaticVanity()
}

async function seedFakeUsers() {
    const users = createFakeUsers()
    const { count } = await prisma.user.deleteMany().then(() =>
        prisma.user.createMany({
            data: users
        })
    )

    // clear old accounts
    const accounts = prisma.account
        .deleteMany()
        .then(() => Promise.all(users.map(user => createAccount(user))))

    // clear old vanity
    const vanities = prisma.vanity
        .deleteMany()
        .then(() => Promise.all(users.map(user => createVanity(user))))

    // clear old sessions
    const sessions = prisma.session
        .deleteMany()
        .then(() => Promise.all(users.map(user => createSession(user))))

    await Promise.all([accounts, vanities, sessions])

    function createFakeUsers() {
        return Array.from(gamertags()).map(name => ({
            id: genRandomString(50),
            destinyMembershipId: "46116860184" + randomNumber(10000000, 99999999),
            destinyMembershipType: Math.floor(Math.random() * 3) + 1,
            name,
            image: "https://picsum.photos/50",
            bungie_access_token: genRandomString(100),
            bungie_access_expires_at: new Date(Date.now() + randomNumber(-10_600_000, 3_600_000)),
            bungie_refresh_token: genRandomString(100),
            bungie_refresh_expires_at: new Date(
                Date.now() + randomNumber(-5_000_000_000, 7_776_000_000)
            ),
            email: name + randomNumber(0, 500) + "@raidhub.com",
            emailVerified: null
        }))
    }

    async function createAccount({ id, destinyMembershipId }: User) {
        return await prisma.account.create({
            data: {
                user: {
                    connect: {
                        id
                    }
                },
                type: "oauth",
                provider: "bungie",
                providerAccountId: destinyMembershipId!,
                access_token: genRandomString(40),
                expires_at: Date.now() / 1000 + randomNumber(-10000000, 100000000),
                refresh_token: genRandomString(40),
                token_type: "Bearer"
            }
        })
    }

    async function createVanity({ id, name, destinyMembershipId, destinyMembershipType }: User) {
        return await prisma.vanity.create({
            data: {
                user: {
                    connect: {
                        id
                    }
                },
                destinyMembershipId: destinyMembershipId!,
                destinyMembershipType: destinyMembershipType!,
                string: name!.substring(0, 5)
            }
        })
    }

    async function createSession({ id }: User) {
        return await prisma.session.create({
            data: {
                user: {
                    connect: {
                        id
                    }
                },
                sessionToken: genRandomString(40),
                expires: new Date(Date.now() + randomNumber(-1000000, 10000000))
            }
        })
    }
    console.log(`Seeded ${count} users.`)
}

async function addStaticVanity() {
    await prisma.vanity.createMany({
        data: [
            {
                string: "Newo",
                destinyMembershipType: BungieMembershipType.TigerSteam,
                destinyMembershipId: "4611686018488107374"
            },
            {
                string: "Bruce",
                destinyMembershipType: BungieMembershipType.TigerSteam,
                destinyMembershipId: "4611686018493378282"
            },
            {
                string: "Theos",
                destinyMembershipType: BungieMembershipType.TigerSteam,
                destinyMembershipId: "4611686018493378282"
            },
            {
                string: "MJ",
                destinyMembershipType: BungieMembershipType.TigerPsn,
                destinyMembershipId: "4611686018478899141"
            },
            {
                string: "Whiz",
                destinyMembershipType: BungieMembershipType.TigerSteam,
                destinyMembershipId: "4611686018470577804"
            },
            {
                string: "Saltagreppo",
                destinyMembershipType: BungieMembershipType.TigerXbox,
                destinyMembershipId: "4611686018432786508"
            },
            {
                string: "retard",
                destinyMembershipId: "4611686018467192472",
                destinyMembershipType: BungieMembershipType.TigerSteam
            }
        ]
    })
}

function genRandomString(length: number) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
    const charLength = chars.length
    let result = ""
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charLength))
    }
    return result
}

function gamertags() {
    return new Set([
        "ArcaneMage",
        "ArcherSorcerer",
        "AracnidSpellcaster",
        "BlazingFury",
        "BlastPhoenix",
        "BlueSamurai",
        "CrownBringer",
        "ChaosTheory",
        "CosmicAngel",
        "CrimsonFury",
        "CryingShadow",
        "CivilKnight",
        "CyberPunk",
        "CloudySamurai",
        "ChivalricShogun",
        "DarkAvenger",
        "DankKnight",
        "DarthLord",
        "DeathStroke",
        "DemonicAngel",
        "DoomBringer",
        "DragonHeart",
        "DeadRider",
        "DrippyPirate",
        "Dreadnaught",
        "EternalDragon",
        "EtheralSlayer",
        "EmberSoldier",
        "EmeraldEnchantress",
        "EverlastingWarrior",
        "Firefly",
        "Firestorm",
        "FrostBite",
        "FourBites",
        "GhostRider",
        "IceQueen",
        "IronClaw",
        "IronFist",
        "JadeEmpress",
        "LethalNinja",
        "LegendaryStrike",
        "LuckyCharm",
        "MajesticShadow",
        "MadWarrior",
        "MysticGamer",
        "NebulaTitan",
        "NewWarrior",
        "NeonAssassin",
        "NextNinja",
        "NightStalker",
        "Noonfall",
        "NoobyChild",
        "NinjaWarrior",
        "PirateKing",
        "PhantomRider",
        "PurgedSniper",
        "PrunedThief",
        "PixelWarrior",
        "RagingBlaze",
        "RancidBull",
        "RabbitStorm",
        "SavageBeast",
        "SanitaryGoddess",
        "SanctifiedHunter",
        "ShadowBlade",
        "ShallowDancer",
        "ShackleSlayer",
        "StarryWalker",
        "SilentAssassin",
        "SilverBullet",
        "SkyRocket",
        "SnazzyShotgun",
        "SneakyNinja",
        "SonicAssault",
        "SlowBlade",
        "SuperBoom",
        "SoulReaper",
        "SourSeeker",
        "StarStriker",
        "SteelWolf",
        "StealthMaster",
        "SteadyRogue",
        "SwordSlayer",
        "StormBreaker",
        "ThunderBolt",
        "TrashyStrike",
        "TumerousNoose",
        "Venomous",
        "VirulentViper",
        "VimStrike",
        "WickedJester",
        "WreckedSorceress",
        "WithstoodWarlock"
    ])
}

function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
}
