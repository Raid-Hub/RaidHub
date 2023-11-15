import styles from "~/styles/pages/profile/mid.module.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { ActivityFilter } from "~/types/profile"
import GroupActivityFilter from "~/models/profile/filters/GroupActivityFilter"
import NotActivityFilter from "~/models/profile/filters/NotActivityFilter"
import HighOrderActivityFilter from "~/models/profile/filters/HighOrderActivityFilter"
import SingleActivityFilter from "~/models/profile/filters/SingleActivityFilter"
import FilterSelectorMenu from "./FilterSelectorMenu"
import { Fragment, createContext, useContext, useState } from "react"
import { useLocale } from "~/components/app/LocaleManager"
import { DefaultActivityFilters } from "~/util/profile/activityFilters"
import PreviousArrow from "~/images/icons/PreviousArrow"

// This contest here stores the callback for the add an item GUI
const SelectMenuContext = createContext<{
    openMenu: (callback: (filter: ActivityFilter) => void) => void
} | null>(null)

const useSelectMenuContext = () => {
    const ctx = useContext(SelectMenuContext)
    if (!ctx) throw new Error("invalid use of SelectMenuContext")
    return ctx
}

interface FilterBuilderForm {
    name: string
    pendingFilter: ActivityFilter | null
}
export default function CustomFilterBuilder({
    returnToMain,
    saveNewFilter
}: {
    returnToMain(): void
    saveNewFilter: (name: string, newFilter: ActivityFilter) => boolean
}) {
    const { handleSubmit, register, formState, getValues, setValue, setError } =
        useForm<FilterBuilderForm>({
            defaultValues: {
                name: ""
            },
            resolver: zodResolver(
                z.object({
                    name: z
                        .string({ required_error: "Must enter a filter name" })
                        .min(1, "Filter name must be longer than 1 character")
                        .max(20, "Filter name cannot be longer than 20 characters"),
                    pendingFilter: z
                        .object(
                            {
                                id: z.string(),
                                predicate: z.function(),
                                encode: z.function(),
                                deepClone: z.function(),
                                stringify: z.function().returns(z.string())
                            },
                            {
                                required_error: "Please select at least one filter",
                                invalid_type_error: "Something went wrong, please reload the page"
                            }
                        )
                        .passthrough()
                        .nullable()
                })
            )
        })
    const pendingFilter = getValues("pendingFilter")

    // We only save the filter if it actually has content
    const onSuccessfulSubmit: SubmitHandler<FilterBuilderForm> = values => {
        if (values.pendingFilter) {
            const success = saveNewFilter(values.name, values.pendingFilter)
            if (success) {
                returnToMain()
            } else {
                setError("name", {
                    message: `Filter ${values.name} already exists.`
                })
            }
        }
    }
    const [isShowingSelect, setIsShowingSelect] = useState(false)
    const [selectCallback, setSelectCallback] = useState<(filter: ActivityFilter) => void>(
        () => () => {} // storing functions in state is probably not the best idea, but this is how u do it
    )

    return (
        <div className={styles["filter-selector-builder"]}>
            <nav className={styles["filter-selector-nav"]} onClick={returnToMain}>
                <PreviousArrow
                    color="white"
                    sx={20}
                    className={styles["filter-selector-nav-arrow"]}
                />
                <span>Back</span>
            </nav>
            <h3>Filter Builder</h3>
            <form onSubmit={handleSubmit(onSuccessfulSubmit)}>
                <input
                    type="text"
                    {...register("name")}
                    placeholder="Enter filter name"
                    aria-label="Filter Name"
                    title="Enter a name for your filter"
                    style={
                        Object.keys(formState.errors).length ? { borderColor: "red" } : undefined
                    }
                />
                <button
                    type="submit"
                    className={styles["filter-selector-builder-button"]}
                    style={{ backgroundColor: "var(--success)" }}>
                    Save
                </button>
                <div className={styles["filter-selector-error"]}>
                    {formState.errors.name && <p>{formState.errors.name.message}</p>}
                    {formState.errors.pendingFilter && (
                        <p>{formState.errors.pendingFilter.message}</p>
                    )}
                </div>
            </form>
            <div className={styles["filter-selector-builder-controls"]}>
                <button
                    onClick={() => setValue("pendingFilter", null, { shouldValidate: true })}
                    className={styles["filter-selector-builder-button"]}
                    style={{ backgroundColor: "var(--destructive)" }}>
                    Clear
                </button>
                <button
                    onClick={() =>
                        setValue("pendingFilter", DefaultActivityFilters, {
                            shouldValidate: true
                        })
                    }
                    className={styles["filter-selector-builder-button"]}
                    style={{ backgroundColor: "var(--destructive)" }}>
                    Reset To Default
                </button>
            </div>
            <SelectMenuContext.Provider
                value={{
                    // in children, we can call "openMenu" and update the state in this component along with the callback
                    openMenu: callback => {
                        setIsShowingSelect(() => true)
                        setSelectCallback(() => callback)
                    }
                }}>
                <div className={styles["filter-selector-block"]}>
                    {pendingFilter ? (
                        <GenericFilterComponent
                            filter={pendingFilter}
                            depth={0}
                            canRemove={true}
                            /* when we remove the top level filter, we just set it to null. Note we always revalidate
                          because otherwise react-hook-form won't do a re-render */
                            removeFromParent={() =>
                                setValue("pendingFilter", null, { shouldValidate: true })
                            }
                        />
                    ) : (
                        <div className={styles["no-filter"]}>
                            <div>No Filter</div>
                            <button
                                onClick={() => {
                                    setIsShowingSelect(true)
                                    // functions in state... essentially, the we define a set-state dispatch that returns our callback function
                                    setSelectCallback(
                                        () => (f: ActivityFilter) =>
                                            setValue("pendingFilter", f, { shouldValidate: true })
                                    )
                                }}>
                                +
                            </button>
                        </div>
                    )}
                </div>
                {isShowingSelect && (
                    <FilterSelectorMenu
                        handleSelect={filter => {
                            // finally use that callback we've been saving in state
                            selectCallback(filter)
                            setIsShowingSelect(false)
                        }}
                        handleClickAway={() => setIsShowingSelect(false)}
                    />
                )}
            </SelectMenuContext.Provider>
        </div>
    )
}

type GenericFilterComponentProps<F extends ActivityFilter = ActivityFilter> = {
    filter: F
    depth: number
    canRemove: boolean
    removeFromParent?(): void
}

const GenericFilterComponent = (props: GenericFilterComponentProps) => {
    if (props.filter instanceof GroupActivityFilter) {
        return <GroupFilterComponent {...props} filter={props.filter} />
    } else if (props.filter instanceof NotActivityFilter) {
        return <NotFilterComponent {...props} filter={props.filter} />
    } else if (props.filter instanceof HighOrderActivityFilter) {
        return <HighOrderFilterComponent {...props} filter={props.filter} />
    } else if (props.filter instanceof SingleActivityFilter) {
        return <SingleFilterComponent {...props} filter={props.filter} />
    } else {
        return null
    }
}

const GroupFilterComponent = ({
    canRemove,
    filter,
    depth,
    removeFromParent
}: GenericFilterComponentProps<GroupActivityFilter>) => {
    const { openMenu } = useSelectMenuContext()
    const [key, setKey] = useState<number>(0)
    return (
        <div className={styles["filter-item"]} key={key}>
            {canRemove && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            {filter.children.size === 0 && (
                <div className={styles["filter-combinator"]}>
                    {filter.combinator == "|" ? "OR" : "AND"}
                </div>
            )}
            {Array.from(filter.children).map(([id, childFilter], idx) => (
                <Fragment key={id}>
                    <GenericFilterComponent
                        filter={childFilter}
                        depth={depth + 1}
                        canRemove={true}
                        removeFromParent={() => {
                            filter.children.delete(id)
                            setKey(Math.random())
                        }}
                    />
                    <div className={styles["filter-combinator"]}>
                        {filter.combinator == "|" ? "OR" : "AND"}
                    </div>
                </Fragment>
            ))}
            <button
                onClick={() =>
                    openMenu(newFilter => {
                        filter.children.set(newFilter.id, newFilter)
                    })
                }>
                +
            </button>
        </div>
    )
}

const NotFilterComponent = ({
    canRemove,
    filter,
    depth,
    removeFromParent
}: GenericFilterComponentProps<NotActivityFilter>) => {
    const { openMenu } = useSelectMenuContext()
    const [key, setKey] = useState<number>(0)
    return (
        <div className={[styles["filter-item"], styles["filter-not"]].join(" ")} key={key}>
            {canRemove && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            <div className={styles["filter-combinator"]}>{"NOT"}</div>
            {filter.child ? (
                <GenericFilterComponent
                    filter={filter.child}
                    depth={depth + 1}
                    canRemove={true}
                    removeFromParent={() => {
                        filter.child = null
                        setKey(Math.random())
                    }}
                />
            ) : (
                <button
                    onClick={() =>
                        openMenu(newFilter => {
                            filter.child = newFilter
                        })
                    }>
                    +
                </button>
            )}
        </div>
    )
}

const HighOrderFilterComponent = ({
    canRemove,
    filter,
    removeFromParent
}: GenericFilterComponentProps<HighOrderActivityFilter>) => {
    const { handleSubmit, register, formState } = useForm({
        defaultValues: {
            value: filter.value
        },
        resolver: zodResolver(z.object({ value: filter.schema }))
    })
    const enteredValue = ({ value }: { value: unknown }) => {
        filter.value = value
    }
    const { strings } = useLocale()

    return (
        <div className={styles["filter-item"]}>
            {canRemove && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            <p>{strings.activityFilters[filter.key]}</p>
            <form onSubmit={handleSubmit(enteredValue)}>
                <input
                    type={filter.inputType}
                    inputMode={filter.inputMode}
                    id="value"
                    {...register("value")}
                />
                <button type="submit">save</button>
            </form>
        </div>
    )
}

const SingleFilterComponent = ({
    canRemove,
    filter,
    removeFromParent
}: GenericFilterComponentProps<SingleActivityFilter>) => {
    return (
        <div className={styles["filter-item"]}>
            {canRemove && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            <p>{filter.key}</p>
        </div>
    )
}
