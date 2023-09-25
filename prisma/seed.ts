import { PrismaClient, Role, User } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/enums"

const prisma = new PrismaClient()

const MAX_FAKE_USERS = 100

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
}

async function seedFakeUsers() {
    const users = generateFakeUsers()

    const seeded = new Array(MAX_FAKE_USERS).fill(null).map((_, i) => i.toString())

    const { count } = await prisma.user
        .deleteMany({
            where: {
                id: {
                    in: seeded
                }
            }
        })
        .then(() =>
            prisma.user.createMany({
                data: users,
                skipDuplicates: true
            })
        )

    const profiles = Promise.all(users.map(user => createProfile(user)))

    const accounts = Promise.all(users.map(user => createAccount(user)))

    const sessions = Promise.all(users.map(user => createSession(user)))

    await Promise.all([profiles, accounts, sessions])

    function generateFakeUsers() {
        return Array.from(gamertags())
            .slice(0, MAX_FAKE_USERS)
            .map((name, idx) => ({
                name,
                role: Role.USER,
                image: "https://picsum.photos/50",
                id: idx.toString(),
                bungieMembershipId: "s212" + randomNumber(10000, 99999),
                destinyMembershipId: "s46116860184" + randomNumber(10000000, 99999999),
                destinyMembershipType: Math.floor(Math.random() * 3) + 1,
                email: name + randomNumber(0, 500) + "@raidhub.app"
            }))
    }

    async function createProfile({
        destinyMembershipId,
        name
    }: Omit<User, "emailVerified"> & { name: string }) {
        return await prisma.profile.create({
            data: {
                user: {
                    connect: {
                        destinyMembershipId
                    }
                },
                bungieUsername: name + "#" + randomNumber(0, 9999),
                twitchUsername: null,
                twitterUsername: null,
                discordUsername: null
            }
        })
    }

    async function createAccount({ destinyMembershipId }: Omit<User, "emailVerified">) {
        return await prisma.account.create({
            data: {
                user: {
                    connect: {
                        destinyMembershipId
                    }
                },
                type: "oauth",
                provider: "bungie",
                providerAccountId: destinyMembershipId,
                access_token: genRandomString(40),
                expires_at: Date.now() / 1000 + randomNumber(-10000000, 100000000),
                refresh_token: genRandomString(40),
                token_type: "Bearer"
            }
        })
    }

    async function createSession({ destinyMembershipId }: Omit<User, "emailVerified">) {
        return await prisma.session.create({
            data: {
                user: {
                    connect: {
                        destinyMembershipId
                    }
                },
                sessionToken: genRandomString(40),
                expires: new Date(Date.now() + randomNumber(-1000000, 10000000))
            }
        })
    }
    console.log(`Seeded ${count} users.`)
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
