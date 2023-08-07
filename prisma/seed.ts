import { PrismaClient, User } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/lib/models"

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
    await addStaticVanity()
}

async function seedFakeUsers() {
    const users = createFakeUsers()

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

    const accounts = Promise.all(users.map(user => createAccount(user)))

    const sessions = Promise.all(users.map(user => createSession(user)))

    await Promise.all([accounts, sessions])

    function createFakeUsers() {
        return Array.from(gamertags())
            .slice(0, MAX_FAKE_USERS)
            .map(
                (name, idx) =>
                    ({
                        id: idx.toString(),
                        destiny_membership_id: "46116860184" + randomNumber(10000000, 99999999),
                        destiny_membership_type: Math.floor(Math.random() * 3) + 1,
                        name,
                        image: "https://picsum.photos/50",
                        bungie_username: name + "#" + randomNumber(0, 9999),
                        twitch_username: null,
                        twitter_username: null,
                        discord_username: null,
                        bungie_access_token: genRandomString(100),
                        bungie_access_expires_at: new Date(
                            Date.now() + randomNumber(-10_600_000, 3_600_000)
                        ),
                        bungie_refresh_token: genRandomString(100),
                        bungie_refresh_expires_at: new Date(
                            Date.now() + randomNumber(-5_000_000_000, 7_776_000_000)
                        ),
                        email: name + randomNumber(0, 500) + "@raidhub.app"
                    } as User)
            )
    }

    async function createAccount({ id, destiny_membership_id }: User) {
        return await prisma.account.create({
            data: {
                user: {
                    connect: {
                        id
                    }
                },
                type: "oauth",
                provider: "bungie",
                providerAccountId: destiny_membership_id!,
                access_token: genRandomString(40),
                expires_at: Date.now() / 1000 + randomNumber(-10000000, 100000000),
                refresh_token: genRandomString(40),
                token_type: "Bearer"
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
    const existing = await prisma.vanity
        .findMany({
            select: {
                string: true,
                destinyMembershipId: true,
                destinyMembershipType: true
            }
        })
        .then(data => data.map(v => v.string))

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
                destinyMembershipId: "4611686018474149055"
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
            }
        ].filter(v => !existing.includes(v.string))
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
