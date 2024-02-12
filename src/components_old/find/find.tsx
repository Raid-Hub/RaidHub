"use client"

import { Collection } from "@discordjs/collection"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef } from "react"
import {
    Control,
    FieldValues,
    Path,
    SubmitHandler,
    UseFormRegister,
    useFieldArray,
    useForm
} from "react-hook-form"
import { useLocale } from "~/app/(layout)/managers/LocaleManager"
import { useRaidHubManifest } from "~/app/(layout)/managers/RaidHubManifestManager"
import { CloudflareImage } from "~/components/CloudflareImage"
import { Loading } from "~/components/Loading"
import { SinglePlayerSearchResult } from "~/components/SinglePlayerSearchResult"
import RaidCardBackground from "~/data/raid-backgrounds"
import { useSeasons } from "~/hooks/dexie/useSeasonDefinition"
import { useSearch } from "~/hooks/useSearch"
import { BungieAPIError } from "~/models/BungieAPIError"
import { activitySearch } from "~/services/raidhub/searchActivities"
import { useRaidHubResolvePlayer } from "~/services/raidhub/useRaidHubResolvePlayers"
import {
    ListedRaid,
    RaidHubActivityExtended,
    RaidHubActivitySearchQuery,
    RaidHubPlayerSearchResult
} from "~/types/raidhub-api"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { getUserName } from "~/util/destiny/bungieName"
import { secondsToHMS } from "~/util/presentation/formatting"
import styles from "./find.module.css"

interface ActivitySearchFormState {
    flawless: -1 | 0 | 1
    fresh: -1 | 0 | 1
    completed: -1 | 0 | 1
    raid: ListedRaid | -1
    players: (
        | { resolved: false; membershipId: string }
        | ({ resolved: true } & RaidHubPlayerSearchResult)
    )[]
    playerCountRange: [number, number]
    dateRange: [Date, Date]
    seasonRange: [number, number]
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
    const { handleSubmit, control, setValue, register, watch } = useForm<ActivitySearchFormState>({
        defaultValues: {
            flawless: -1,
            fresh: -1,
            completed: -1,
            raid: -1,
            players: []
        }
    })

    const submitHandler: SubmitHandler<ActivitySearchFormState> = state => {
        const minDate = new Date(state.dateRange[0])
        const maxDate = new Date(state.dateRange[1])
        search({
            membershipId: [sessionMembershipId, ...state.players.map(p => p.membershipId)],
            flawless: state.flawless === -1 ? undefined : !!state.flawless,
            fresh: state.fresh === -1 ? undefined : !!state.fresh,
            completed: state.completed === -1 ? undefined : !!state.completed,
            raid: state.raid === -1 ? undefined : state.raid,
            minPlayers: state.playerCountRange[0] === 0 ? undefined : state.playerCountRange[0],
            maxPlayers: state.playerCountRange[1] === 0 ? undefined : state.playerCountRange[1],
            minSeason: state.seasonRange[0] === 0 ? undefined : state.seasonRange[0],
            maxSeason: state.seasonRange[1] === 0 ? undefined : state.seasonRange[1],
            minDate: !isNaN(minDate.getTime()) ? minDate : undefined,
            maxDate: !isNaN(maxDate.getTime()) ? maxDate : undefined
        })
    }

    const {
        mutate: search,
        isLoading,
        isSuccess,
        data
    } = useMutation<
        Collection<string, RaidHubActivityExtended>,
        BungieAPIError<unknown>,
        RaidHubActivitySearchQuery
    >({
        mutationFn: activitySearch
    })

    const players = watch("players")

    return (
        <main>
            <h1>Activity Finder</h1>
            <form onSubmit={handleSubmit(submitHandler)} className={styles["form-container"]}>
                <div className={styles["form"]}>
                    <div className={styles["players"]}>
                        <h2>Players</h2>
                        <div className={styles["players-components"]}>
                            <PlayerLookup addPlayer={r => setValue("players", [...players, r])} />
                            <AddedPlayers
                                control={control}
                                sessionMembershipId={sessionMembershipId}
                            />
                        </div>
                    </div>
                    <div className={styles["gadgets"]}>
                        <h2 style={{ width: "100%" }}>Filters</h2>
                        <RaidPicker id="raid" label="Raid" register={register} />
                        <ToggleOption id="completed" label="Completed" register={register} />
                        <ToggleOption id="fresh" label="Fresh Instance" register={register} />
                        <ToggleOption id="flawless" label="Flawless" register={register} />
                        <div className={styles["gadget-group"]}>
                            <h4>Player Count</h4>
                            <div>
                                <PlayerCountPicker
                                    id="playerCountRange.0"
                                    label="Min"
                                    register={register}
                                />
                                <PlayerCountPicker
                                    id="playerCountRange.1"
                                    label="Max"
                                    register={register}
                                />
                            </div>
                        </div>
                        <div className={styles["gadget-group"]}>
                            <h4>Season Range</h4>
                            <div>
                                <SeasonPicker id="seasonRange.0" label="Min" register={register} />
                                <SeasonPicker id="seasonRange.1" label="Max" register={register} />
                            </div>
                        </div>
                        <div className={styles["gadget-group"]}>
                            <h4>Date Range</h4>
                            <div>
                                <DatePicker id="dateRange.0" label="Min" register={register} />
                                <DatePicker id="dateRange.1" label="Max" register={register} />
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

const PlayerLookup = ({
    addPlayer
}: {
    addPlayer: (p: ActivitySearchFormState["players"][number]) => void
}) => {
    const playerSearch = useSearch()

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
                            size={2}
                            noLink
                            handleSelect={() => {
                                addPlayer({ ...r, resolved: true })
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
    control: Control<ActivitySearchFormState, any>
    sessionMembershipId: string
}) => {
    const { fields, remove } = useFieldArray({
        control,
        name: "players"
    })

    return (
        <div className={styles["selected-players"]}>
            <h3>Selected Players</h3>
            <ul>
                <li>
                    <PickedPlayer membershipId={sessionMembershipId} resolved={false} />
                </li>
                {fields.map((player, index) => (
                    <li key={player.id}>
                        <PickedPlayer {...player} />
                        <button type="button" onClick={() => remove(index)} style={{ flexGrow: 0 }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const PickedPlayer = (player: ActivitySearchFormState["players"][number]) => {
    // if we dont have the player we can just use the membershipId to get the player
    const query = useRaidHubResolvePlayer(player.membershipId, {
        initialData: player.resolved ? player : undefined,
        enabled: !player.resolved,
        staleTime: Infinity
    })

    if (query.isSuccess) {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                    width={45}
                    height={45}
                    alt={query.data.bungieGlobalDisplayName ?? query.data.displayName ?? "Guardian"}
                    unoptimized
                    src={bungieIconUrl(query.data.iconPath ?? undefined)}
                />
                <div>{getUserName(query.data)}</div>
            </div>
        )
    } else {
        return <div>{player.membershipId}</div>
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
        <div className={styles["gadget"]}>
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
        <div className={styles["gadget"]}>
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
        <div className={styles["gadget"]}>
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
        <div className={styles["gadget"]}>
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
        <div className={styles["gadget"]}>
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
        <section className={styles["results"]} ref={scrollTargetRef}>
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
            className={styles["tile"]}
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
                    {secondsToHMS(Math.floor((completed.getTime() - started.getTime()) / 1000))}
                </div>
            </div>
        </Link>
    )
}
