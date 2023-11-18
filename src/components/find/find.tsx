import styles from "./find.module.css"
import { Collection } from "@discordjs/collection"
import { useMutation, useQuery } from "@tanstack/react-query"
import { z } from "zod"
import Activity from "~/models/profile/data/Activity"
import {
    activitySearch,
    activitySearchQueryKey,
    activitySearchQuerySchema
} from "~/services/raidhub/activitySearch"
import { wait } from "~/util/wait"
import ActivityTile from "../profile/raids/ActivityTile"
import { useMemo } from "react"
import { Control, Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import ToggleSwitch from "../reusable/ToggleSwitch"
import { useRaidHubSearch } from "~/hooks/raidhub/useRaidHubSearch"
import { RaidHubSearchResult } from "~/types/raidhub-api"
import UserName from "../profile/user/UserName"
import Image from "next/image"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import TwoThumbSlider from "../reusable/TwoThumbSlider"

interface ActivitySearchFormState {
    flawlessOnly: boolean
    completionOnly: boolean
    freshOnly: boolean
    players: ({ membershipId: string } | RaidHubSearchResult)[]
    playerCountRange: [number, number]
}

// membershipId: z
//             .union([z.array(numberString).min(1), numberString.transform(s => [s])])
//             .optional(),
// minPlayers: z.coerce.number().int().nonnegative().optional(),
// maxPlayers: z.coerce.number().int().nonnegative().optional(),
// minDate: z.coerce.date().optional(),
// maxDate: z.coerce.date().optional(),
// minSeason: z.coerce.number().int().nonnegative().optional(),
// maxSeason: z.coerce.number().int().nonnegative().optional(),
// fresh: booleanString.optional(),
// completed: booleanString.optional(),
// raid: z.coerce
//     .number()
//     .int()
//     .positive()
//     .refine(n => includedIn(ListedRaids, n), {
//         message: "invalid raid value"
//     })
//     .optional(),
// platformType: z.coerce.number().int().positive().optional(),
// reversed: z.coerce.boolean().default(false),
// page: z.coerce.number().int().positive().default(1)

export default function Find({
    query,
    appendToQuery,
    setQueryKey,
    removeFromQuery
}: {
    query: z.infer<typeof activitySearchQuerySchema>
    setQueryKey: (key: string, value: string) => void
    appendToQuery: (key: string, value: string) => void
    removeFromQuery: (key: string, value?: string | undefined) => void
}) {
    const { formState, handleSubmit, control, setValue, getValues, watch } =
        useForm<ActivitySearchFormState>({
            defaultValues: {
                flawlessOnly: !!query.flawless,
                completionOnly: !!query.completed,
                freshOnly: !!query.fresh,
                players: query.membershipIds?.map(m => ({ membershipId: m })) ?? [],
                playerCountRange: [query.minPlayers ?? 1, query.maxPlayers ?? 6]
            }
        })

    const submitHandler: SubmitHandler<ActivitySearchFormState> = ({
        flawlessOnly,
        completionOnly,
        freshOnly,
        players,
        playerCountRange: [min, max]
    }) => {
        const searchString = new URLSearchParams()
        if (flawlessOnly) {
            setQueryKey("flawless", "true")
            searchString.set("flawless", "true")
        } else {
            removeFromQuery("flawless")
        }

        if (freshOnly) {
            setQueryKey("fresh", "true")
            searchString.set("fresh", "true")
        } else {
            removeFromQuery("fresh")
        }

        if (completionOnly) {
            setQueryKey("completed", "true")
            searchString.set("completed", "true")
        } else {
            removeFromQuery("completed")
        }

        removeFromQuery("membershipId")
        players.forEach(p => {
            searchString.append("membershipId", p.membershipId)
            appendToQuery("membershipId", p.membershipId)
        })

        setQueryKey("minPlayers", String(min))
        searchString.set("minPlayers", String(min))
        setQueryKey("maxPlayers", String(max))
        searchString.set("minPlayers", String(max))

        search(searchString)
    }

    const players = watch("players")

    console.log(formState.isLoading, formState.isSubmitted, formState.isSubmitSuccessful)

    const {
        mutate: search,
        isLoading,
        isSuccess,
        data,
        isError,
        error
    } = useMutation<Collection<string, Activity>, Error, URLSearchParams>({
        mutationFn: params => wait(500).then(() => activitySearch(params.toString()))
    })

    return (
        <main>
            <h1>Activity Finder</h1>
            <form onSubmit={handleSubmit(submitHandler)} className={styles["form"]}>
                <div className={styles["players"]}>
                    <h2>Players</h2>
                    <div>
                        <PlayerLookup addPlayer={r => setValue("players", [...players, r])} />
                        <AddedPlayers control={control} />
                    </div>
                </div>
                <div className={styles["gadgets"]}>
                    <div>
                        <label htmlFor="completion">Completions Only</label>
                        <Controller
                            control={control}
                            name="completionOnly"
                            render={({ field }) => (
                                <ToggleSwitch
                                    onToggle={field.onChange}
                                    size={20}
                                    value={field.value}
                                    label="completion"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label htmlFor="fresh">Fresh Runs Only</label>
                        <Controller
                            control={control}
                            name="freshOnly"
                            render={({ field }) => (
                                <ToggleSwitch
                                    onToggle={field.onChange}
                                    size={20}
                                    value={field.value}
                                    label="fresh"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label htmlFor="flawless">Flawlesses Only</label>
                        <Controller
                            control={control}
                            name="flawlessOnly"
                            render={({ field }) => (
                                <ToggleSwitch
                                    onToggle={field.onChange}
                                    size={20}
                                    value={field.value}
                                    label="flawless"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label htmlFor="completion">Player Range</label>
                        <Controller
                            control={control}
                            name="playerCountRange"
                            render={({ field }) => (
                                <TwoThumbSlider
                                    onChange={field.onChange}
                                    values={field.value}
                                    labels={["min", "max"]}
                                    min={1}
                                    max={8}
                                    scale={v => (v < 7 ? v : v === 8 ? 16384 : 100)}
                                />
                            )}
                        />
                    </div>
                </div>
                <button type="submit" disabled={!players.length || isLoading}>
                    Search
                </button>
            </form>
            {isError && <div>{error.message}</div>}
            {isLoading ? <div>{"Loading..."}</div> : isSuccess && <Results allResults={data} />}
        </main>
    )
}

const PlayerLookup = ({ addPlayer }: { addPlayer: (p: RaidHubSearchResult) => void }) => {
    const playerSearch = useRaidHubSearch()

    return (
        <div className={styles["player-search"]}>
            <h3>
                <label htmlFor="addPlayers">Add Players</label>
            </h3>
            <input
                id="addPlayers"
                type="text"
                onChange={playerSearch.handleInputChange}
                value={playerSearch.enteredText}
            />
            {playerSearch.enteredText && (
                <div className={styles["player-search-results"]}>
                    <h4>Results</h4>
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

const AddedPlayers = ({ control }: { control: Control<ActivitySearchFormState, any> }) => {
    const { fields, remove } = useFieldArray({
        control,
        name: "players"
    })

    return (
        <div>
            <h3>Added Players</h3>
            <ul>
                {fields.map((player, index) => (
                    <li key={player.id}>
                        <div>{player.membershipId}</div>
                        <button type="button" onClick={() => remove(index)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const Results = ({ allResults }: { allResults: Collection<string, Activity> }) => {
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

    return (
        <section className={styles["results"]}>
            <h2>Search Results</h2>
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
        </section>
    )
}
