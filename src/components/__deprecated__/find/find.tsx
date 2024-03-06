"use client"

import { Collection } from "@discordjs/collection"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef } from "react"
import {
    useFieldArray,
    useForm,
    type Control,
    type FieldValues,
    type Path,
    type SubmitHandler,
    type UseFormRegister
} from "react-hook-form"
import { z } from "zod"
import { useLocale } from "~/app/layout/managers/LocaleManager"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { CloudflareImage } from "~/components/CloudflareImage"
import { Loading } from "~/components/Loading"
import { SinglePlayerSearchResult } from "~/components/SinglePlayerSearchResult"
import { Raid } from "~/data/raid"
import RaidCardBackground from "~/data/raid-backgrounds"
import { useSeasons } from "~/hooks/dexie"
import { useSearch } from "~/hooks/useSearch"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { type BungieAPIError } from "~/models/BungieAPIError"
import { useRaidHubResolvePlayer } from "~/services/raidhub/hooks"
import { activitySearch } from "~/services/raidhub/searchActivities"
import type {
    ListedRaid,
    RaidHubActivityExtended,
    RaidHubActivitySearchQuery,
    RaidHubPlayerInfo
} from "~/services/raidhub/types"
import { bungieProfileIconUrl } from "~/util/destiny"
import { getBungieDisplayName } from "~/util/destiny/getBungieDisplayName"
import { includedIn } from "~/util/helpers"
import { secondsToHMS } from "~/util/presentation/formatting"
import styles from "./find.module.css"

interface ActivitySearchFormState {
    membershipIds: { membershipId: string }[]
    flawless: -1 | 0 | 1
    fresh: -1 | 0 | 1
    completed: -1 | 0 | 1
    raid: ListedRaid | -1
    minPlayers: number
    maxPlayers: number
    minSeason: number
    maxSeason: number
    minDate: Date
    maxDate: Date
}

//  TODO:
// platformType: z.coerce.number().int().positive().optional(),
// reversed: z.coerce.boolean().default(false),
// page: z.coerce.number().int().positive().default(1)

const playerCounts = [1, 2, 3, 4, 5, 6, 12, 50]

/**
 * @deprecated
 */
export default function Find({ sessionMembershipId }: { sessionMembershipId: string }) {
    const { get, getAll, append, set, clear, commit } = useQueryParams<{
        membershipId?: string
        flawless?: "true" | "false"
        fresh?: "true" | "false"
        completed?: "true" | "false"
        raid?: `${ListedRaid}`
        minPlayers?: string
        maxPlayers?: string
        minSeason?: string
        maxSeason?: string
        minDate?: string
        maxDate?: string
    }>()

    const { handleSubmit, control, setValue, register, watch } = useForm<ActivitySearchFormState>({
        defaultValues: async () => ({
            membershipIds:
                getAll("membershipId")
                    ?.filter((m): m is string => !!m && m !== sessionMembershipId)
                    .map(m => ({ membershipId: m })) ?? [],
            flawless: get("flawless") === "true" ? 1 : get("flawless") === "false" ? 0 : -1,
            fresh: get("fresh") === "true" ? 1 : get("fresh") === "false" ? 0 : -1,
            completed: get("completed") === "true" ? 1 : get("completed") === "false" ? 0 : -1,
            raid: (() => {
                const parsed = z.coerce
                    .number()
                    .int()
                    .positive()
                    .refine(n => includedIn(Object.values(Raid), n))
                    .optional()
                    .safeParse(get("raid"))
                return parsed.success ? (parsed.data as ListedRaid) : -1
            })(),
            minPlayers: (() => {
                const parsed = z.coerce.number().int().nonnegative().safeParse(get("minPlayers"))
                return parsed.success ? parsed.data : 0
            })(),
            maxPlayers: (() => {
                const parsed = z.coerce.number().int().nonnegative().safeParse(get("maxPlayers"))
                return parsed.success ? parsed.data : 0
            })(),
            minSeason: (() => {
                const parsed = z.coerce.number().int().nonnegative().safeParse(get("minSeason"))
                return parsed.success ? parsed.data : 0
            })(),
            maxSeason: (() => {
                const parsed = z.coerce.number().int().nonnegative().safeParse(get("maxSeason"))
                return parsed.success ? parsed.data : 0
            })(),
            minDate: (() => {
                const parsed = z.coerce.date().safeParse(get("minDate"))
                return parsed.success ? parsed.data : new Date(0)
            })(),
            maxDate: (() => {
                const parsed = z.coerce.date().safeParse(get("maxDate"))
                return parsed.success ? parsed.data : new Date(0)
            })()
        })
    })

    const submitHandler: SubmitHandler<ActivitySearchFormState> = state => {
        const minDate = new Date(state.minDate)
        const maxDate = new Date(state.maxDate)

        const values = {
            membershipId: Array.from(
                new Set(state.membershipIds.map(m => m.membershipId)).add(sessionMembershipId)
            ),
            flawless: state.flawless === -1 ? undefined : !!state.flawless,
            fresh: state.fresh === -1 ? undefined : !!state.fresh,
            completed: state.completed === -1 ? undefined : !!state.completed,
            raid: state.raid === -1 ? undefined : state.raid,
            minPlayers: state.minPlayers === 0 ? undefined : state.minPlayers,
            maxPlayers: state.maxPlayers === 0 ? undefined : state.maxPlayers,
            minSeason: state.minSeason === 0 ? undefined : state.minSeason,
            maxSeason: state.maxSeason === 0 ? undefined : state.maxSeason,
            minDate: !isNaN(minDate.getTime() || NaN) ? minDate.toISOString() : undefined,
            maxDate: !isNaN(maxDate.getTime() || NaN) ? maxDate.toISOString() : undefined
        } as const

        clear()
        values.membershipId.forEach(m =>
            append("membershipId", m, {
                commit: false
            })
        )
        if (values.fresh !== undefined) {
            set("fresh", `${values.fresh}`, {
                commit: false
            })
        }
        if (values.completed !== undefined) {
            set("completed", `${values.completed}`, {
                commit: false
            })
        }
        if (values.flawless !== undefined) {
            set("flawless", `${values.flawless}`, {
                commit: false
            })
        }
        if (values.raid !== undefined) {
            set("raid", `${values.raid}`, {
                commit: false
            })
        }
        if (values.minPlayers !== undefined) {
            set("minPlayers", `${values.minPlayers}`, {
                commit: false
            })
        }
        if (values.maxPlayers !== undefined) {
            set("maxPlayers", `${values.maxPlayers}`, {
                commit: false
            })
        }
        if (values.minSeason !== undefined) {
            set("minSeason", `${values.minSeason}`, {
                commit: false
            })
        }
        if (values.maxSeason !== undefined) {
            set("maxSeason", `${values.maxSeason}`, {
                commit: false
            })
        }
        if (values.minDate !== undefined) {
            set("minDate", `${values.minDate}`, {
                commit: false
            })
        }
        if (values.maxDate !== undefined) {
            set("maxDate", `${values.maxDate}`, {
                commit: false
            })
        }

        commit()
        search(values)
    }

    const {
        mutate: search,
        isLoading,
        isSuccess,
        data
    } = useMutation<
        Collection<string, RaidHubActivityExtended>,
        BungieAPIError,
        RaidHubActivitySearchQuery
    >({
        mutationFn: activitySearch
    })

    const players = watch("membershipIds")

    return (
        <main>
            <h1>Activity Finder</h1>
            <form onSubmit={handleSubmit(submitHandler)} className={styles["form-container"]}>
                <div className={styles.form}>
                    <div className={styles.players}>
                        <h2>Players</h2>
                        <div className={styles["players-components"]}>
                            <PlayerLookup
                                addPlayer={membershipId =>
                                    setValue("membershipIds", [...players, { membershipId }])
                                }
                            />
                            <AddedPlayers
                                control={control}
                                sessionMembershipId={sessionMembershipId}
                            />
                        </div>
                    </div>
                    <div className={styles.gadgets}>
                        <h2 style={{ width: "100%" }}>Filters</h2>
                        <RaidPicker id="raid" label="Raid" register={register} />
                        <ToggleOption id="completed" label="Completed" register={register} />
                        <ToggleOption id="fresh" label="Fresh Instance" register={register} />
                        <ToggleOption id="flawless" label="Flawless" register={register} />
                        <div className={styles["gadget-group"]}>
                            <h4>Player Count</h4>
                            <div>
                                <PlayerCountPicker
                                    id="minPlayers"
                                    label="Min"
                                    register={register}
                                />
                                <PlayerCountPicker
                                    id="maxPlayers"
                                    label="Max"
                                    register={register}
                                />
                            </div>
                        </div>
                        <div className={styles["gadget-group"]}>
                            <h4>Season Range</h4>
                            <div>
                                <SeasonPicker id="minSeason" label="Min" register={register} />
                                <SeasonPicker id="maxSeason" label="Max" register={register} />
                            </div>
                        </div>
                        <div className={styles["gadget-group"]}>
                            <h4>Date Range</h4>
                            <div>
                                <DatePicker id="minDate" label="Min" register={register} />
                                <DatePicker id="maxDate" label="Max" register={register} />
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" disabled={isLoading} role="button">
                    Search
                </button>
            </form>
            {isLoading ? <Loading /> : isSuccess && <Results allResults={data} />}
        </main>
    )
}

const PlayerLookup = ({ addPlayer }: { addPlayer: (p: string) => void }) => {
    const playerSearch = useSearch()
    const queryClient = useQueryClient()

    return (
        <div className={styles["player-search"]}>
            <h3>
                <label htmlFor="addPlayers">Player Search</label>
            </h3>
            <input
                id="addPlayers"
                type="text"
                onChange={playerSearch.handleInputChange}
                value={playerSearch.enteredText}
            />
            {playerSearch.enteredText && (
                <div className={styles["player-search-results"]}>
                    {playerSearch.results.map(r => (
                        <SinglePlayerSearchResult
                            key={r.membershipId}
                            player={r}
                            size={1.25}
                            noLink
                            handleSelect={() => {
                                queryClient.setQueryData<RaidHubPlayerInfo>(
                                    ["raidhub", "player", "basic", r.membershipId],
                                    r
                                )
                                addPlayer(r.membershipId)
                                playerSearch.clearQuery()
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const AddedPlayers = ({
    control,
    sessionMembershipId
}: {
    control: Control<ActivitySearchFormState>
    sessionMembershipId: string
}) => {
    const { fields, remove } = useFieldArray({
        control,
        name: "membershipIds"
    })

    return (
        <div className={styles["selected-players"]}>
            <h3>Selected Players</h3>
            <ul>
                <li>
                    <PickedPlayer membershipId={sessionMembershipId} />
                </li>
                {fields.map((field, index) => (
                    <li key={field.id}>
                        <PickedPlayer membershipId={field.membershipId} />
                        <button type="button" onClick={() => remove(index)} style={{ flexGrow: 0 }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const PickedPlayer = ({ membershipId }: { membershipId: string }) => {
    // if we dont have the player we can just use the membershipId to get the player
    const query = useRaidHubResolvePlayer(membershipId, {
        staleTime: Infinity
    })

    if (query.isSuccess) {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Image
                    width={45}
                    height={45}
                    alt={query.data.bungieGlobalDisplayName ?? query.data.displayName ?? "Guardian"}
                    unoptimized
                    src={bungieProfileIconUrl(query.data.iconPath)}
                />
                <div>{getBungieDisplayName(query.data)}</div>
            </div>
        )
    } else {
        return <div>{membershipId}</div>
    }
}

function ToggleOption<T extends FieldValues>({
    id,
    label,
    register
}: {
    label: string
    id: Path<T>
    register: UseFormRegister<T>
}) {
    return (
        <div className={styles.gadget}>
            <label htmlFor={id}>{label}</label>
            <select id={id} {...register(id, { valueAsNumber: true })}>
                <option value={-1}>Ignore</option>
                <option value={1}>{`${label}`}</option>
                <option value={0}>{`Not ${label}`}</option>
            </select>
        </div>
    )
}

function PlayerCountPicker<T extends FieldValues>({
    id,
    label,
    register
}: {
    label: string
    id: Path<T>
    register: UseFormRegister<T>
}) {
    return (
        <div className={styles.gadget}>
            <label htmlFor={id}>{label}</label>
            <select id={id} {...register(id, { valueAsNumber: true })}>
                <option value={0}>None</option>
                <>
                    {playerCounts.map(i => (
                        <option value={i} key={i}>
                            {i}
                        </option>
                    ))}
                </>
            </select>
        </div>
    )
}

function DatePicker<T extends FieldValues>({
    id,
    label,
    register
}: {
    label: string
    id: Path<T>
    register: UseFormRegister<T>
}) {
    return (
        <div className={styles.gadget}>
            <label htmlFor={id}>{label}</label>
            <input type="date" id={id} {...register(id, { valueAsDate: true })} />
        </div>
    )
}

function SeasonPicker<T extends FieldValues>({
    id,
    label,
    register
}: {
    label: string
    id: Path<T>
    register: UseFormRegister<T>
}) {
    const seasons = useSeasons({
        reversed: true
    })

    return (
        <div className={styles.gadget}>
            <label htmlFor={id}>{label}</label>
            <select id={id} {...register(id, { valueAsNumber: true })}>
                <option value={0}>None</option>
                <>
                    {seasons?.map(s => (
                        <option key={s.hash} value={s.seasonNumber}>
                            [{s.seasonNumber}] {s.displayProperties.name || "Red War"}
                        </option>
                    ))}
                </>
            </select>
        </div>
    )
}

function RaidPicker<T extends FieldValues>({
    id,
    label,
    register
}: {
    label: string
    id: Path<T>
    register: UseFormRegister<T>
}) {
    const { listedRaids, getRaidString } = useRaidHubManifest()

    return (
        <div className={styles.gadget}>
            <label htmlFor={id}>{label}</label>
            <select id={id} {...register(id, { valueAsNumber: true })}>
                <option value={-1}>None</option>
                <>
                    {listedRaids?.map(r => (
                        <option key={r} value={r}>
                            {getRaidString(r)}
                        </option>
                    ))}
                </>
            </select>
        </div>
    )
}

const Results = ({ allResults }: { allResults: Collection<string, RaidHubActivityExtended> }) => {
    const scrollTargetRef = useRef<HTMLDivElement>(null)
    const results = useMemo(() => {
        const partioned = new Collection<string, Collection<string, RaidHubActivityExtended>>()
        allResults.forEach(a => {
            const key = `${new Date(a.dateCompleted).getMonth()}-${new Date(
                a.dateCompleted
            ).getFullYear()}`
            if (partioned.has(key)) {
                partioned.get(key)!.set(a.instanceId, a)
            } else {
                partioned.set(
                    key,
                    new Collection<string, RaidHubActivityExtended>([[a.instanceId, a]])
                )
            }
        })
        return partioned
    }, [allResults])

    useEffect(() => {
        if (scrollTargetRef.current) {
            scrollTargetRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
    }, [])

    return (
        <section className={styles.results} ref={scrollTargetRef}>
            <h2>Search Results</h2>
            {!!results.size ? (
                <div>
                    {results.map((p, k) => {
                        const first = p.first()
                        if (!first) return null
                        const date = new Date(first.dateCompleted)
                        return (
                            <div key={k}>
                                <h3>
                                    {date.toLocaleDateString(undefined, {
                                        month: "long",
                                        year: "numeric",
                                        day: undefined
                                    })}
                                </h3>
                                <div className={styles["results-set"]}>
                                    {p.map(a => (
                                        <Tile activity={a} key={a.instanceId} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div>No raids found.</div>
            )}
        </section>
    )
}

const Tile = ({ activity }: { activity: RaidHubActivityExtended }) => {
    const { locale } = useLocale()
    const { getRaidFromHash, getRaidString } = useRaidHubManifest()
    const meta = getRaidFromHash(activity.raidHash)
    const completed = new Date(activity.dateCompleted)
    const started = new Date(activity.dateStarted)
    return (
        <Link
            href={`/pgcr/${activity.instanceId}`}
            className={styles.tile}
            style={{ border: `1px solid ${activity.completed ? "Green" : "Red"}` }}>
            {meta && (
                <CloudflareImage
                    cloudflareId={RaidCardBackground[meta.raid]}
                    alt={`Raid card for ${getRaidString(meta.raid)}`}
                    fill
                    sizes="160px"
                />
            )}
            <div className={styles["tile-overlay"]}>
                <div className={styles["tile-date"]}>
                    {completed.toLocaleDateString(locale, {
                        month: "long",
                        day: "numeric"
                    })}
                </div>
                <div className={styles["tile-time"]}>
                    {secondsToHMS(
                        Math.floor((completed.getTime() - started.getTime()) / 1000),
                        false
                    )}
                </div>
            </div>
        </Link>
    )
}
