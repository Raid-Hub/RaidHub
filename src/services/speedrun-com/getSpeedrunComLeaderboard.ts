import { LeaderboardEntry, LeaderboardEntryParticipant } from "../../types/leaderboards"
import { ListedRaid } from "../../types/raids"
import { SpeedrunBoardId, SpeedrunVariables, destiny2GameId } from "~/data/speedrun-com-mappings"

export const rtaSpeedrunQueryKey = "rta-leaderboards"

export type SpeedrunQueryArgs<
    R extends ListedRaid,
    K extends (typeof SpeedrunVariables)[R] extends { values: infer D }
        ? keyof D
        : (typeof SpeedrunVariables)[R] extends null
        ? never
        : string
> = (typeof SpeedrunVariables)[R] extends null
    ? {
          raid: R
      }
    : {
          raid: R
          category?: K | null
      }

export async function getSpeedrunComLeaderboard<
    R extends ListedRaid,
    K extends (typeof SpeedrunVariables)[R] extends { values: infer D }
        ? keyof D
        : (typeof SpeedrunVariables)[R] extends null
        ? never
        : string
>(params: SpeedrunQueryArgs<R, K>): Promise<LeaderboardEntry[]> {
    if (!SpeedrunBoardId[params.raid]) {
        return []
    }

    const url = new URL(
        `https://www.speedrun.com/api/v1/leaderboards/${destiny2GameId}/category/${
            SpeedrunBoardId[params.raid]
        }`
    )

    const mappings = SpeedrunVariables[params.raid]
    if (mappings && "category" in params && params.category) {
        const key = `var-${mappings.variable}`
        // @ts-ignore
        const value = mappings.values[params.category].id

        url.searchParams.append(key, value)
    }

    url.searchParams.append("embed", "players")

    const res = await fetch(url, {
        method: "GET"
    })

    if (res.ok) {
        const { data } = (await res.json()) as SpeedrunLeaderboardResponse
        return data.runs.map(
            r =>
                ({
                    id: r.run.id,
                    rank: r.place,
                    url: r.run.weblink,
                    participants: r.run.players.map(p => {
                        if (p.rel === "user") {
                            const player = data.players.data.find(def => def.id === p.id)!
                            return {
                                id: p.id,
                                iconURL: player.assets?.image.uri
                                    ? `https://www.speedrun.com/static/user/${p.id}/image.png`
                                    : null,
                                displayName: player.names.international,
                                url: player.weblink
                            } satisfies LeaderboardEntryParticipant
                        } else {
                            return {
                                id: p.name,
                                iconURL: null,
                                displayName: p.name,
                                url: null
                            } satisfies LeaderboardEntryParticipant
                        }
                    }),
                    videoURL: r.run.videos.links[0]?.uri,
                    timeInSeconds: r.run.times.primary_t
                } satisfies LeaderboardEntry)
        )
    } else {
        console.error(await res.json())
        throw new Error("Invalid response")
    }
}

type SpeedrunLeaderboardResponse = {
    data: {
        weblink: string
        game: string
        category: string
        level: null
        platform: null
        region: null
        emulators: null
        "video-only": boolean
        timing: "realtime"
        values: {}
        runs: SpeedrunLeaderboardRun[]
        links: {
            rel: string
            uri: string
        }[]
        players: {
            data: SpeedrunLeaderboardPlayer[]
        }
    }
}

type SpeedrunLeaderboardRun = {
    place: number
    run: {
        id: string
        weblink: string
        game: string
        level: null
        category: string
        videos: {
            links: {
                uri: string
            }[]
        }
        comment: null
        status: {
            status: string
            examiner: string
            "verify-date": string
        }
        players: (
            | {
                  rel: "user"
                  id: string
                  uri: string
              }
            | {
                  rel: "guest"
                  name: string
                  uri: string
              }
        )[]
        date: string
        submitted: string
        times: {
            primary: "PT12M23S"
            primary_t: number
            realtime: "PT12M23S"
            realtime_t: number
            realtime_noloads: null
            realtime_noloads_t: number
            ingame: null
            ingame_t: number
        }
        system: {
            platform: string
            emulated: false
            region: null
        }
        splits: null
        values: Record<string, string>
    }
}

type SpeedrunLeaderboardPlayer = {
    id: string
    assets?: {
        icon: {
            uri: string | null
        }
        image: {
            uri: string | null
        }
    }
    names: {
        international: string
        japanese: null
    }
    weblink: string
    "name-style": {
        style: string
        color: {
            light: string
            dark: string
        }
    }
    role: string
    signup: string
    location: {
        country: {
            code: string
            names: {
                international: string
                japanese: string
            }
        }
        region: {
            code: string
            names: {
                international: string
                japanese: string
            }
        }
    }
    twitch: {
        uri: string
    } | null
    hitbox: {
        uri: string
    } | null
    youtube: {
        uri: string
    } | null
    twitter: {
        uri: string
    } | null
    speedrunslive: {
        uri: "http://www.speedrunslive.com/profiles/#!/username"
    } | null
    links: {
        rel: string
        uri: string
    }[]
}
