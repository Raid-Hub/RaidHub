import styles from "./find.module.css"
import { Collection } from "@discordjs/collection"
import { useMutation, useQuery } from "@tanstack/react-query"
import { z } from "zod"
import Activity from "~/models/profile/data/Activity"
import { activitySearch, activitySearchQuerySchema } from "~/services/raidhub/activitySearch"
import ActivityTile from "../profile/raids/ActivityTile"
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
import { useRaidHubSearch } from "~/hooks/raidhub/useRaidHubSearch"
import { RaidHubSearchResult } from "~/types/raidhub-api"
import UserName from "../profile/user/UserName"
import Image from "next/image"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { useSeasons } from "../app/DestinyManifestManager"
import { ListedRaid, ListedRaids } from "~/types/raids"
import { useLocale } from "../app/LocaleManager"
import ErrorComponent from "../global/Error"
import CustomError, { ErrorCode } from "~/models/errors/CustomError"
import Loading from "../global/Loading"
import { getRaidHubMember, getRaidHubMemberQueryKey } from "~/services/raidhub/getMember"

interface ActivitySearchFormState {
    flawless: -1 | 0 | 1
    fresh: -1 | 0 | 1
    completed: -1 | 0 | 1
    raid: ListedRaid | -1
    players: ({ membershipId: string } | RaidHubSearchResult)[]
    playerCountRange: [number, number]
    dateRange: [Date, Date]
    seasonRange: [number, number]
}

//  TODO:
// platformType: z.coerce.number().int().positive().optional(),
// reversed: z.coerce.boolean().default(false),
// page: z.coerce.number().int().positive().default(1)

const playerCounts = [1, 2, 3, 4, 5, 6, 12, 50]

export default function Find({
    query,
    replaceAllQueryParams,
    sessionMembershipId
}: {
    query: z.infer<typeof activitySearchQuerySchema>
    replaceAllQueryParams: (searchParams: URLSearchParams) => void
    sessionMembershipId: string
}) {
    const { handleSubmit, control, setValue, register, watch } = useForm<ActivitySearchFormState>({
        defaultValues: {
            flawless: query.flawless === undefined ? -1 : query.flawless ? 1 : 0,
            completed: query.completed === undefined ? -1 : query.completed ? 1 : 0,
            fresh: query.fresh === undefined ? -1 : query.fresh ? 1 : 0,
            raid: -1,
            players:
                query.membershipIds
                    ?.filter(m => m !== sessionMembershipId)
                    .map(m => ({ membershipId: m })) ?? [],
            playerCountRange: [query.minPlayers, query.maxPlayers],
            dateRange: [query.minDate, query.maxDate],
            seasonRange: [query.minSeason, query.maxSeason]
        }
    })

    const submitHandler: SubmitHandler<ActivitySearchFormState> = ({
        flawless,
        completed,
        fresh,
        raid,
        players,
        playerCountRange: [minPlayers, maxPlayers],
        seasonRange: [minSeason, maxSeason],
        dateRange: [minDate, maxDate]
    }) => {
        const searchString = new URLSearchParams()

        searchString.append("membershipId", sessionMembershipId)

        players.forEach(p => {
            searchString.append("membershipId", p.membershipId)
        })

        if (fresh !== -1) {
            searchString.set("fresh", String(!!fresh))
        }

        if (completed !== -1) {
            searchString.set("completed", String(!!completed))
        }

        if (flawless !== -1) {
            searchString.set("flawless", String(!!flawless))
        }

        if (raid !== -1) {
            searchString.set("raid", String(raid))
        }

        if (minPlayers) {
            searchString.set("minPlayers", String(minPlayers))
        }

        if (maxPlayers) {
            searchString.set("maxPlayers", String(maxPlayers))
        }

        if (!Number.isNaN(minDate.getTime())) {
            searchString.set("minDate", minDate.toLocaleString())
        }

        if (!Number.isNaN(maxDate.getTime())) {
            searchString.set("maxDate", maxDate.toLocaleString())
        }

        if (minSeason) {
            searchString.set("minSeason", String(minSeason))
        }

        if (maxSeason) {
            searchString.set("maxSeason", String(maxSeason))
        }

        replaceAllQueryParams(searchString)
        search(searchString)
    }

    const {
        mutate: search,
        isLoading,
        isSuccess,
        data,
        isError,
        error
    } = useMutation<Collection<string, Activity>, Error, URLSearchParams>({
        mutationFn: params => activitySearch(params.toString())
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
            {isError && (
                <ErrorComponent error={CustomError.handle(error, ErrorCode.ActivitySearch)} />
            )}
            {isLoading ? (
                <Loading className={styles["loading"]} />
            ) : (
                isSuccess && <Results allResults={data} />
            )}
        </main>
    )
}

const PlayerLookup = ({ addPlayer }: { addPlayer: (p: RaidHubSearchResult) => void }) => {
    const playerSearch = useRaidHubSearch()

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
                        <div
                            key={r.membershipId}
                            onClick={() => {
                                addPlayer(r)
                                playerSearch.clearQuery()
                            }}>
                            <Image
                                width={45}
                                height={45}
                                alt={r.bungieGlobalDisplayName ?? r.displayName}
                                unoptimized
                                src={bungieIconUrl(r.iconPath)}
                                style={{ borderRadius: "5px" }}
                            />
                            <UserName {...r} />
                        </div>
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
                    <PickedPlayer membershipId={sessionMembershipId} />
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

const PickedPlayer = (player: RaidHubSearchResult | { membershipId: string }) => {
    // if we dont have the player we can just use the membershipId to get the player
    const { ...q } = useQuery({
        queryFn: () => getRaidHubMember(player.membershipId),
        queryKey: getRaidHubMemberQueryKey(player.membershipId),
        enabled: !("lastSeen" in player),
        staleTime: Infinity
    })

    if ("lastSeen" in player || q.isSuccess) {
        const resolved = q.data ?? (player as RaidHubSearchResult)
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                    width={45}
                    height={45}
                    alt={resolved.bungieGlobalDisplayName ?? resolved.displayName ?? "Guardian"}
                    unoptimized
                    src={bungieIconUrl(resolved.iconPath ?? undefined)}
                />
                <UserName {...resolved} displayName={resolved.displayName ?? "Guardian"} />
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
    const { data: seasons } = useSeasons({
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
    const { strings } = useLocale()
    return (
        <div className={styles["gadget"]}>
            <label htmlFor={id}>{label}</label>
            <select id={id} {...register(id, { valueAsNumber: true })}>
                <option value={-1}>None</option>
                <>
                    {ListedRaids?.map(r => (
                        <option key={r} value={r}>
                            {strings.raidNames[r]}
                        </option>
                    ))}
                </>
            </select>
        </div>
    )
}

const Results = ({ allResults }: { allResults: Collection<string, Activity> }) => {
    const scrollTargetRef = useRef<HTMLDivElement>(null)
    const results = useMemo(() => {
        const partioned = new Collection<string, Collection<string, Activity>>()
        allResults.forEach(a => {
            const key = `${a.dateCompleted.getMonth()}-${a.dateCompleted.getFullYear()}`
            if (partioned.has(key)) {
                partioned.get(key)!.set(a.activityId, a)
            } else {
                partioned.set(key, new Collection<string, Activity>([[a.activityId, a]]))
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
                    {results.map((p, k) => (
                        <div key={k}>
                            <h3>
                                {p.first()?.dateCompleted.toLocaleDateString(undefined, {
                                    month: "long",
                                    year: "numeric",
                                    day: undefined
                                })}
                            </h3>
                            <div className={styles["results-set"]}>
                                {p.map(a => (
                                    <ActivityTile activity={a} key={a.activityId} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No raids found.</div>
            )}
        </section>
    )
}
