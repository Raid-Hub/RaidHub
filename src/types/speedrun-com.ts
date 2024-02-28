export type SpeedrunLeaderboardResponse = {
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
        values: unknown
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
