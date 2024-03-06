/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


/** OneOf type helpers */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
type OneOf<T extends any[]> = T extends [infer Only] ? Only : T extends [infer A, infer B, ...infer Rest] ? OneOf<[XOR<A, B>, ...Rest]> : never;

export interface paths {
  "/manifest": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["ManifestResponse"];
          };
        };
      };
    };
  };
  "/player/search": {
    get: {
      parameters: {
        query: {
          count?: number;
          query: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["PlayerSearchResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["QueryValidationError"];
          };
        };
      };
    };
  };
  "/player/{membershipId}/activities": {
    get: {
      parameters: {
        query?: {
          count?: number;
          cursor?: string;
        };
        path: {
          membershipId: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["PlayerActivitiesResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["QueryValidationError"];
          };
        };
        /** @description Not found */
        404: {
          content: {
            readonly "application/json": {
              /** @enum {boolean} */
              readonly notFound: true;
              readonly membershipId: string;
            } | components["schemas"]["PathValidationError"];
          };
        };
      };
    };
  };
  "/player/{membershipId}/basic": {
    get: {
      parameters: {
        path: {
          membershipId: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["PlayerBasicResponse"];
          };
        };
        /** @description Not found */
        404: {
          content: {
            readonly "application/json": {
              /** @enum {boolean} */
              readonly notFound: true;
              readonly membershipId: string;
            } | components["schemas"]["PathValidationError"];
          };
        };
      };
    };
  };
  "/player/{membershipId}/profile": {
    get: {
      parameters: {
        path: {
          membershipId: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["PlayerProfileResponse"];
          };
        };
        /** @description Not found */
        404: {
          content: {
            readonly "application/json": {
              /** @enum {boolean} */
              readonly notFound: true;
              readonly membershipId: string;
            } | components["schemas"]["PathValidationError"];
          };
        };
      };
    };
  };
  "/activity/search": {
    post: {
      readonly requestBody?: {
        readonly content: {
          readonly "application/json": components["schemas"]["ActivitySearchBody"];
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["ActivitySearchResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["BodyValidationError"];
          };
        };
      };
    };
  };
  "/activity/{instanceId}": {
    get: {
      parameters: {
        path: {
          instanceId: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["ActivityResponse"];
          };
        };
        /** @description Not found */
        404: {
          content: {
            readonly "application/json": {
              /** @enum {boolean} */
              readonly notFound: true;
              readonly instanceId: string;
            } | components["schemas"]["PathValidationError"];
          };
        };
      };
    };
  };
  "/leaderboard/search": {
    get: {
      parameters: {
        query: {
          type: "worldfirst" | "individual" | "global";
          membershipId: string;
          count?: number;
          category: ("normal" | "prestige" | "challenge" | "master") | ("fresh" | "total" | "sherpas" | "trios" | "duos" | "solos") | ("total-clears" | "sherpas" | "full-clears" | "cumulative-speedrun");
          raid?: number;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["LeaderboardSearchResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["QueryValidationError"];
          };
        };
        /** @description LeaderboardNotFoundError */
        404: {
          content: {
            readonly "application/json": {
              /** @enum {boolean} */
              readonly notFound: true;
              readonly params: {
                readonly membershipId: string;
                /** @default 25 */
                readonly count?: number;
                readonly type: "individual" | "worldfirst" | "global";
                readonly category: string;
                readonly raid?: components["schemas"]["RaidEnum"];
              };
            };
          };
        };
      };
    };
  };
  "/leaderboard/global/{category}": {
    get: {
      parameters: {
        query?: {
          count?: number;
          page?: number;
        };
        path: {
          category: "total-clears" | "sherpas" | "full-clears" | "cumulative-speedrun";
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["LeaderboardGlobalResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["QueryValidationError"];
          };
        };
        /** @description Not found */
        404: {
          content: {
            readonly "application/json": components["schemas"]["PathValidationError"];
          };
        };
      };
    };
  };
  "/leaderboard/{raid}/worldfirst/{category}": {
    get: {
      parameters: {
        query?: {
          count?: number;
          page?: number;
        };
        path: {
          raid: components["schemas"]["RaidPath"];
          category: "normal" | "prestige" | "challenge" | "master";
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["LeaderboardWorldfirstResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["QueryValidationError"];
          };
        };
        /** @description Not found */
        404: {
          content: {
            readonly "application/json": ({
              /** @enum {boolean} */
              readonly notFound: true;
              readonly params: {
                readonly raid: components["schemas"]["RaidPath"];
                /** @enum {string} */
                readonly category: "normal" | "prestige" | "challenge" | "master";
                /** @default 50 */
                readonly count?: number;
                /** @default 1 */
                readonly page?: number;
              };
            }) | components["schemas"]["PathValidationError"];
          };
        };
      };
    };
  };
  "/leaderboard/{raid}/individual/{category}": {
    get: {
      parameters: {
        query?: {
          count?: number;
          page?: number;
        };
        path: {
          raid: components["schemas"]["RaidPath"];
          category: "fresh" | "total" | "sherpas" | "trios" | "duos" | "solos";
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["LeaderboardIndividualResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["QueryValidationError"];
          };
        };
        /** @description Not found */
        404: {
          content: {
            readonly "application/json": {
              /** @enum {boolean} */
              readonly unavailable: true;
            } | components["schemas"]["PathValidationError"];
          };
        };
      };
    };
  };
  "/leaderboard/{raid}/speedrun": {
    get: {
      parameters: {
        query?: {
          count?: number;
          page?: number;
        };
        path: {
          raid: components["schemas"]["RaidPath"];
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["LeaderboardSpeedrunResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["QueryValidationError"];
          };
        };
        /** @description Not found */
        404: {
          content: {
            readonly "application/json": components["schemas"]["PathValidationError"];
          };
        };
      };
    };
  };
  "/pgcr/{instanceId}": {
    get: {
      parameters: {
        path: {
          instanceId: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["PgcrResponse"];
          };
        };
        /** @description Not found */
        404: {
          content: {
            readonly "application/json": {
              /** @enum {boolean} */
              readonly notFound: true;
              readonly instanceId: string;
            } | components["schemas"]["PathValidationError"];
          };
        };
      };
    };
  };
  "/admin/query": {
    post: {
      readonly requestBody?: {
        readonly content: {
          readonly "application/json": {
            readonly query: string;
            /** @enum {string} */
            readonly type: "SELECT" | "EXPLAIN";
            /** @default false */
            readonly ignoreCost?: boolean;
          };
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["AdminQueryResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["BodyValidationError"];
          };
        };
        /** @description AdminQuerySyntaxError */
        501: {
          content: {
            readonly "application/json": components["schemas"]["AdminQuerySyntaxError"];
          };
        };
      };
    };
  };
  "/authorize": {
    post: {
      readonly requestBody?: {
        readonly content: {
          readonly "application/json": {
            readonly clientSecret: string;
          };
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            readonly "application/json": components["schemas"]["AuthorizeResponse"];
          };
        };
        /** @description Bad request */
        400: {
          content: {
            readonly "application/json": components["schemas"]["BodyValidationError"];
          };
        };
        /** @description InvalidClientSecretError */
        403: {
          content: {
            readonly "application/json": {
              /** @enum {boolean} */
              readonly unauthorized: true;
            };
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /** @enum {integer} */
    readonly BungieMembershipType: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 10 | 254 | -1;
    /** @enum {integer} */
    readonly RaidEnum: 13 | 12 | 11 | 10 | 9 | 8 | 7 | 4 | 6 | 5 | 3 | 2 | 1;
    /** @enum {integer} */
    readonly RaidVersionEnum: 1 | 2 | 3 | 4 | 64 | 65 | 66;
    /**
     * @example {
     *   "bungieGlobalDisplayName": "Newo",
     *   "bungieGlobalDisplayNameCode": "9010",
     *   "membershipId": "4611686018488107374",
     *   "displayName": "xx_newo_xx",
     *   "iconPath": "/common/destiny2_content/icons/93844c8b76ea80683a880479e3506980.jpg",
     *   "membershipType": 3,
     *   "lastSeen": "2021-05-01T00:00:00.000Z"
     * }
     */
    readonly PlayerInfo: {
      readonly membershipId: string;
      readonly membershipType: components["schemas"]["BungieMembershipType"];
      readonly iconPath: string | null;
      /** @description The platform-specific display name of the player. No longer shown in-game. */
      readonly displayName: string | null;
      readonly bungieGlobalDisplayName: string | null;
      readonly bungieGlobalDisplayNameCode: string | null;
      /** Format: date-time */
      readonly lastSeen: string;
    };
    readonly Activity: {
      readonly instanceId: string;
      readonly raidHash: string;
      readonly completed: boolean;
      readonly flawless: boolean | null;
      readonly fresh: boolean | null;
      readonly playerCount: number;
      /** Format: date-time */
      readonly dateStarted: string;
      /** Format: date-time */
      readonly dateCompleted: string;
      readonly duration: number;
      readonly platformType?: components["schemas"]["BungieMembershipType"];
    };
    readonly ActivityExtended: components["schemas"]["Activity"] & {
      readonly dayOne: boolean;
      readonly contest: boolean;
      readonly weekOne: boolean;
    };
    readonly ActivityPlayerData: {
      readonly finishedRaid: boolean;
      readonly kills: number;
      readonly assists: number;
      readonly deaths: number;
      readonly timePlayedSeconds: number;
      readonly classHash: string | null;
      readonly sherpas: number;
      readonly isFirstClear: boolean;
    };
    /**
     * @example {
     *   "bungieGlobalDisplayName": "Newo",
     *   "bungieGlobalDisplayNameCode": "9010",
     *   "membershipId": "4611686018488107374",
     *   "displayName": "xx_newo_xx",
     *   "iconPath": "/common/destiny2_content/icons/93844c8b76ea80683a880479e3506980.jpg",
     *   "membershipType": 3,
     *   "lastSeen": "2021-05-01T00:00:00.000Z"
     * }
     */
    readonly PlayerWithActivityData: components["schemas"]["PlayerInfo"] & {
      readonly data: components["schemas"]["ActivityPlayerData"];
    };
    readonly ActivityWithPlayerData: components["schemas"]["ActivityExtended"] & {
      readonly player: components["schemas"]["ActivityPlayerData"];
    };
    /** @enum {string} */
    readonly RaidHubErrorCode: "Unknown" | "PlayerNotFoundError" | "ActivityNotFoundError" | "PGCRNotFoundError" | "LeaderboardNotFoundError" | "InvalidClientSecretError" | "InsufficientPermissionsError" | "PathValidationError" | "QueryValidationError" | "BodyValidationError" | "InternalServerError" | "ApiKeyError" | "AdminQuerySyntaxError";
    readonly RaidHubError: {
      /** Format: date-time */
      readonly minted: string;
      readonly message: string;
      /** @enum {boolean} */
      readonly success: false;
      readonly error: {
        /** @enum {string} */
        readonly type: "Unknown" | "PlayerNotFoundError" | "ActivityNotFoundError" | "PGCRNotFoundError" | "LeaderboardNotFoundError" | "InvalidClientSecretError" | "InsufficientPermissionsError" | "PathValidationError" | "QueryValidationError" | "BodyValidationError" | "InternalServerError" | "ApiKeyError" | "AdminQuerySyntaxError";
        [key: string]: unknown;
      };
    };
    readonly ZodIssue: {
      readonly fatal?: boolean;
      readonly message: string;
      readonly path: readonly (string | number)[];
      /** @enum {string} */
      readonly code: "invalid_type" | "invalid_literal" | "custom" | "invalid_union" | "invalid_union_discriminator" | "invalid_enum_value" | "unrecognized_keys" | "invalid_arguments" | "invalid_return_type" | "invalid_date" | "invalid_string" | "too_small" | "too_big" | "invalid_intersection_types" | "not_multiple_of" | "not_finite";
    };
    readonly PathValidationError: components["schemas"]["RaidHubError"] & {
      /** @enum {string} */
      readonly message?: "Invalid path params";
      readonly error?: {
        /** @enum {string} */
        readonly type: "PathValidationError";
        readonly issues: readonly components["schemas"]["ZodIssue"][];
      };
    };
    readonly QueryValidationError: components["schemas"]["RaidHubError"] & {
      /** @enum {string} */
      readonly message?: "Invalid query params";
      readonly error?: {
        /** @enum {string} */
        readonly type: "QueryValidationError";
        readonly issues: readonly components["schemas"]["ZodIssue"][];
      };
    };
    readonly BodyValidationError: components["schemas"]["RaidHubError"] & {
      /** @enum {string} */
      readonly message?: "Invalid JSON body";
      readonly error?: {
        /** @enum {string} */
        readonly type: "BodyValidationError";
        readonly issues: readonly components["schemas"]["ZodIssue"][];
      };
    };
    readonly InternalServerError: components["schemas"]["RaidHubError"] & ({
      /** @enum {string} */
      readonly message?: "Something went wrong.";
      readonly error?: {
        /** @enum {string} */
        readonly type: "InternalServerError";
        readonly at: string | null;
      };
    });
    readonly InsufficientPermissionsError: components["schemas"]["RaidHubError"] & {
      readonly error?: {
        /** @enum {string} */
        readonly type: "InsufficientPermissionsError";
        /** @enum {string} */
        readonly message: "Forbidden";
      };
    };
    readonly ApiKeyError: components["schemas"]["RaidHubError"] & ({
      readonly message?: "Invalid API Key" | "Missing API Key";
      readonly error?: {
        /** @enum {string} */
        readonly type: "ApiKeyError";
        readonly apiKey: string | null;
        readonly origin: string | null;
      };
    });
    readonly ActivitySearchBody: {
      readonly membershipId: string | (readonly string[]);
      readonly minPlayers?: number | null;
      readonly maxPlayers?: number | null;
      readonly minDate?: string | null;
      readonly maxDate?: string | null;
      readonly minSeason?: number | null;
      readonly maxSeason?: number | null;
      readonly fresh?: boolean;
      readonly completed?: boolean;
      readonly flawless?: boolean;
      readonly raid?: components["schemas"]["RaidEnum"];
      readonly platformType?: number;
      /** @default false */
      readonly reversed?: boolean | null;
      /** @default 25 */
      readonly count?: number;
      /** @default 1 */
      readonly page?: number;
    };
    readonly AdminQuerySyntaxError: {
      readonly name: string;
      readonly code: string;
      readonly message: string;
    };
    /** @enum {string} */
    readonly RaidPath: "leviathan" | "eaterofworlds" | "spireofstars" | "lastwish" | "scourgeofthepast" | "crownofsorrow" | "gardenofsalvation" | "deepstonecrypt" | "vaultofglass" | "vowofthedisciple" | "kingsfall" | "rootofnightmares" | "crotasend";
    readonly IndividualLeaderboardEntry: {
      readonly position: number;
      readonly rank: number;
      readonly value: number;
      readonly player: components["schemas"]["PlayerInfo"];
    };
    readonly WorldFirstLeaderboardEntry: {
      readonly position: number;
      readonly rank: number;
      readonly value: number;
      readonly activity: components["schemas"]["Activity"];
      readonly players: readonly components["schemas"]["PlayerWithActivityData"][];
    };
    readonly LeaderboardSearchQuery: {
      readonly type: "worldfirst" | "individual" | "global";
      readonly membershipId: string;
      /** @default 25 */
      readonly count?: number;
      readonly category: ("normal" | "prestige" | "challenge" | "master") | ("fresh" | "total" | "sherpas" | "trios" | "duos" | "solos") | ("total-clears" | "sherpas" | "full-clears" | "cumulative-speedrun");
      readonly raid?: number;
    };
    /** @enum {integer} */
    readonly SunsetRaidEnum: 1 | 2 | 3 | 5 | 6;
    /** @enum {integer} */
    readonly MasterRaidEnum: 9 | 10 | 11 | 12 | 13;
    /** @enum {integer} */
    readonly PrestigeRaidEnum: 1 | 2 | 3;
    /** @enum {integer} */
    readonly ContestRaidEnum: 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
    /** @description A raw PGCR with a few redundant fields removed */
    readonly DestinyPostGameCarnageReport: {
      readonly period: string;
      readonly startingPhaseIndex?: number;
      readonly activityWasStartedFromBeginning?: boolean;
      readonly activityDetails: {
        readonly directorActivityHash: string;
        readonly instanceId: string;
        /** @enum {integer} */
        readonly mode: 0 | 2 | 3 | 4 | 5 | 6 | 7 | 9 | 10 | 11 | 12 | 13 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91;
        readonly modes: readonly (0 | 2 | 3 | 4 | 5 | 6 | 7 | 9 | 10 | 11 | 12 | 13 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91)[];
        readonly membershipType: components["schemas"]["BungieMembershipType"];
      };
      readonly entries: readonly ({
          readonly player: {
            readonly destinyUserInfo: {
              readonly iconPath?: string | null;
              readonly crossSaveOverride: components["schemas"]["BungieMembershipType"];
              readonly applicableMembershipTypes?: (readonly components["schemas"]["BungieMembershipType"][]) | null;
              readonly membershipType?: components["schemas"]["BungieMembershipType"];
              readonly membershipId: string;
              readonly displayName?: string | null;
              readonly bungieGlobalDisplayName?: string | null;
              readonly bungieGlobalDisplayNameCode?: number | null;
            };
            readonly characterClass?: string | null;
            readonly classHash: number;
            readonly raceHash: number;
            readonly genderHash: number;
            readonly characterLevel: number;
            readonly lightLevel: number;
            readonly emblemHash: number;
          };
          readonly characterId: string;
          readonly values: {
            [key: string]: {
              readonly basic: {
                readonly value: number;
                readonly displayValue: string;
              };
            };
          };
          readonly extended?: {
            readonly weapons?: (readonly {
                readonly referenceId: number;
                readonly values: {
                  [key: string]: {
                    readonly basic: {
                      readonly value: number;
                      readonly displayValue: string;
                    };
                  };
                };
              }[]) | null;
            readonly values: {
              [key: string]: {
                readonly basic: {
                  readonly value: number;
                  readonly displayValue: string;
                };
              };
            };
          };
        })[];
    };
    readonly PlayerStatRanking: {
      readonly value: number | null;
      readonly rank: number | null;
    };
    readonly PlayerProfileLeaderboardEntry: {
      readonly rank: number;
      readonly instanceId: string;
      readonly boardId: string;
      /** @enum {string} */
      readonly type: "Normal" | "Challenge" | "Prestige" | "Master";
      readonly raidHash: string;
      /** Format: date-time */
      readonly dateCompleted: string;
      readonly dayOne: boolean;
      readonly contest: boolean;
      readonly weekOne: boolean;
    };
    readonly ManifestResponse: {
      readonly hashes: {
        [key: string]: {
          readonly raid: components["schemas"]["RaidEnum"];
          readonly version: components["schemas"]["RaidVersionEnum"];
        };
      };
      readonly listed: readonly components["schemas"]["RaidEnum"][];
      readonly sunset: readonly components["schemas"]["SunsetRaidEnum"][];
      readonly contest: readonly components["schemas"]["ContestRaidEnum"][];
      readonly master: readonly components["schemas"]["MasterRaidEnum"][];
      readonly prestige: readonly components["schemas"]["PrestigeRaidEnum"][];
      readonly reprisedChallengePairings: readonly {
          readonly raid: components["schemas"]["RaidEnum"];
          readonly version: components["schemas"]["RaidVersionEnum"];
          readonly triumphName: string;
        }[];
      readonly leaderboards: {
        readonly global: readonly ({
            /** @enum {string} */
            readonly category: "total-clears" | "sherpas" | "full-clears" | "cumulative-speedrun";
            readonly displayName: string;
            /** @enum {string} */
            readonly format: "number" | "time";
          })[];
        readonly worldFirst: {
          [key: string]: readonly ({
              readonly id: string;
              readonly displayName: string;
              /** @enum {string} */
              readonly category: "normal" | "prestige" | "challenge" | "master";
              /** Format: date-time */
              readonly date: string;
            })[];
        };
        readonly individual: {
          readonly clears: {
            [key: string]: readonly ({
                readonly displayName: string;
                /** @enum {string} */
                readonly category: "fresh" | "total" | "trios" | "duos" | "solos";
              })[];
          };
        };
      };
      readonly raidUrlPaths: {
        [key: string]: components["schemas"]["RaidPath"];
      };
      readonly raidStrings: {
        [key: string]: string;
      };
      readonly difficultyStrings: {
        [key: string]: string;
      };
      readonly checkpointNames: {
        [key: string]: string;
      };
    };
    readonly PlayerSearchResponse: {
      readonly params: {
        readonly count: number;
        readonly term: {
          readonly name: string;
          readonly nameWithCode: string | null;
        };
      };
      readonly results: readonly (components["schemas"]["PlayerInfo"] & {
          readonly clears: number;
        })[];
    };
    readonly PlayerActivitiesResponse: {
      readonly membershipId: string;
      readonly activities: readonly (components["schemas"]["ActivityWithPlayerData"] & {
          readonly meta: {
            readonly raid: components["schemas"]["RaidEnum"];
            readonly version: components["schemas"]["RaidVersionEnum"];
          };
        })[];
      readonly nextCursor: string | null;
    };
    /**
     * @example {
     *   "bungieGlobalDisplayName": "Newo",
     *   "bungieGlobalDisplayNameCode": "9010",
     *   "membershipId": "4611686018488107374",
     *   "displayName": "xx_newo_xx",
     *   "iconPath": "/common/destiny2_content/icons/93844c8b76ea80683a880479e3506980.jpg",
     *   "membershipType": 3,
     *   "lastSeen": "2021-05-01T00:00:00.000Z"
     * }
     */
    readonly PlayerBasicResponse: {
      readonly membershipId: string;
      readonly membershipType: components["schemas"]["BungieMembershipType"];
      readonly iconPath: string | null;
      /** @description The platform-specific display name of the player. No longer shown in-game. */
      readonly displayName: string | null;
      readonly bungieGlobalDisplayName: string | null;
      readonly bungieGlobalDisplayNameCode: string | null;
      /** Format: date-time */
      readonly lastSeen: string;
    };
    readonly PlayerProfileResponse: {
      readonly player: components["schemas"]["PlayerInfo"];
      readonly stats: {
        readonly global: {
          readonly clears: components["schemas"]["PlayerStatRanking"];
          readonly fullClears: components["schemas"]["PlayerStatRanking"];
          readonly sherpas: components["schemas"]["PlayerStatRanking"];
          readonly speed: components["schemas"]["PlayerStatRanking"];
        } | null;
        readonly byRaid: {
          [key: string]: {
            readonly fastestClear: {
              /** Format: int64 */
              readonly instanceId: number;
              readonly duration: number;
            } | null;
            readonly clears: number;
            readonly fullClears: number;
            readonly sherpas: number;
            readonly trios: number;
            readonly duos: number;
            readonly solos: number;
          };
        };
      };
      readonly worldFirstEntries: readonly components["schemas"]["PlayerProfileLeaderboardEntry"][];
    };
    readonly ActivitySearchResponse: {
      readonly query: components["schemas"]["ActivitySearchBody"];
      readonly results: readonly components["schemas"]["ActivityExtended"][];
    };
    readonly ActivityResponse: components["schemas"]["ActivityExtended"] & {
      readonly meta: {
        readonly raid: components["schemas"]["RaidEnum"];
        readonly raidName: string;
        readonly version: components["schemas"]["RaidVersionEnum"];
        readonly versionName: string;
      };
      readonly leaderboardEntries: {
        [key: string]: number;
      };
      readonly players: readonly components["schemas"]["PlayerWithActivityData"][];
    };
    readonly LeaderboardSearchResponse: {
      readonly params: {
        readonly type: "individual" | "worldfirst" | "global";
        readonly category: string;
        readonly raid?: components["schemas"]["RaidEnum"];
        readonly membershipId: string;
        /** @default 25 */
        readonly count?: number;
      };
      readonly page: number;
      readonly rank: number;
      readonly position: number;
      readonly entries: readonly (components["schemas"]["IndividualLeaderboardEntry"] | components["schemas"]["WorldFirstLeaderboardEntry"])[];
    };
    readonly LeaderboardGlobalResponse: {
      readonly params: {
        /** @enum {string} */
        readonly category: "total-clears" | "sherpas" | "full-clears" | "cumulative-speedrun";
        readonly count: number;
        /** @default 1 */
        readonly page?: number;
      };
      readonly entries: readonly components["schemas"]["IndividualLeaderboardEntry"][];
    };
    readonly LeaderboardWorldfirstResponse: {
      readonly params: {
        readonly raid: components["schemas"]["RaidPath"];
        /** @enum {string} */
        readonly category: "normal" | "prestige" | "challenge" | "master";
        /** @default 50 */
        readonly count?: number;
        /** @default 1 */
        readonly page?: number;
      };
      /** Format: date-time */
      readonly date: string;
      readonly entries: readonly components["schemas"]["WorldFirstLeaderboardEntry"][];
    };
    readonly LeaderboardIndividualResponse: {
      readonly params: {
        readonly raid: components["schemas"]["RaidPath"];
        /** @enum {string} */
        readonly category: "fresh" | "total" | "sherpas" | "trios" | "duos" | "solos";
        readonly count: number;
        /** @default 1 */
        readonly page?: number;
      };
      readonly entries: readonly components["schemas"]["IndividualLeaderboardEntry"][];
    };
    readonly LeaderboardSpeedrunResponse: {
      readonly params: {
        readonly count: number;
        /** @default 1 */
        readonly page?: number;
        readonly raid: components["schemas"]["RaidPath"];
      };
      readonly entries: readonly {
          readonly rank: number;
          readonly instanceId: string;
          /** Format: date-time */
          readonly dateStarted: string;
          /** Format: date-time */
          readonly dateCompleted: string;
          readonly duration: number;
          readonly players: readonly components["schemas"]["PlayerWithActivityData"][];
        }[];
    };
    /** @description A raw PGCR with a few redundant fields removed */
    readonly PgcrResponse: {
      readonly period: string;
      readonly startingPhaseIndex?: number;
      readonly activityWasStartedFromBeginning?: boolean;
      readonly activityDetails: {
        readonly directorActivityHash: string;
        readonly instanceId: string;
        /** @enum {integer} */
        readonly mode: 0 | 2 | 3 | 4 | 5 | 6 | 7 | 9 | 10 | 11 | 12 | 13 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91;
        readonly modes: readonly (0 | 2 | 3 | 4 | 5 | 6 | 7 | 9 | 10 | 11 | 12 | 13 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91)[];
        readonly membershipType: components["schemas"]["BungieMembershipType"];
      };
      readonly entries: readonly ({
          readonly player: {
            readonly destinyUserInfo: {
              readonly iconPath?: string | null;
              readonly crossSaveOverride: components["schemas"]["BungieMembershipType"];
              readonly applicableMembershipTypes?: (readonly components["schemas"]["BungieMembershipType"][]) | null;
              readonly membershipType?: components["schemas"]["BungieMembershipType"];
              readonly membershipId: string;
              readonly displayName?: string | null;
              readonly bungieGlobalDisplayName?: string | null;
              readonly bungieGlobalDisplayNameCode?: number | null;
            };
            readonly characterClass?: string | null;
            readonly classHash: number;
            readonly raceHash: number;
            readonly genderHash: number;
            readonly characterLevel: number;
            readonly lightLevel: number;
            readonly emblemHash: number;
          };
          readonly characterId: string;
          readonly values: {
            [key: string]: {
              readonly basic: {
                readonly value: number;
                readonly displayValue: string;
              };
            };
          };
          readonly extended?: {
            readonly weapons?: (readonly {
                readonly referenceId: number;
                readonly values: {
                  [key: string]: {
                    readonly basic: {
                      readonly value: number;
                      readonly displayValue: string;
                    };
                  };
                };
              }[]) | null;
            readonly values: {
              [key: string]: {
                readonly basic: {
                  readonly value: number;
                  readonly displayValue: string;
                };
              };
            };
          };
        })[];
    };
    readonly AdminQueryResponse: OneOf<[{
      /** @enum {string} */
      readonly type: "SELECT";
      readonly data: readonly {
          [key: string]: unknown;
        }[];
    }, {
      /** @enum {string} */
      readonly type: "HIGH COST";
      readonly data: unknown;
      readonly cost: number;
      readonly estimatedDuration: number;
    }, {
      /** @enum {string} */
      readonly type: "EXPLAIN";
      readonly data: readonly string[];
    }]>;
    readonly AuthorizeResponse: {
      readonly value: string;
      /** Format: date-time */
      readonly expires: string;
    };
  };
  responses: never;
  parameters: {
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;
