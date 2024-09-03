"use client"

import Link from "next/link"
import { useRef } from "react"
import { z } from "zod"
import { Flex } from "~/components/layout/Flex"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { useSmoothAnchorScroll } from "~/hooks/util/useSmoothAnchorScroll"
import { useLocale } from "../layout/wrappers/LocaleManager"
import { WeaponTables } from "./WeaponTables"

const x = z.object({
    sort: z.enum(["kills", "usage"])
}).shape

type SortKey = "kills" | "usage"

export default function Page() {
    const { locale, userAgent } = useLocale()
    const count = userAgent.device.type === "mobile" ? 10 : 25

    const { set: setParam, get: getParam } = useQueryParams(
        z.object({
            sort: z.enum(["kills", "usage"])
        })
    )

    const [sort, setSort] = useLocalStorage("weapon-meta-sort", () => getParam("sort", "kills"))

    const now = new Date()
    const lastWeek = new Date(now)
    lastWeek.setDate(now.getDate() - 7)

    const ref = useRef<HTMLDivElement>(null)
    useSmoothAnchorScroll(ref)

    return (
        <div>
            <div ref={ref}>
                <h1
                    style={{
                        marginBottom: "0.2rem"
                    }}>
                    Weapon Meta
                </h1>
                <div style={{ marginBottom: "1.25rem" }}>
                    <i>
                        {lastWeek.toLocaleDateString(locale, {
                            dateStyle: "medium"
                        })}
                        {" - "}
                        {now.toLocaleDateString(locale, {
                            dateStyle: "medium"
                        })}
                    </i>
                </div>
                <div
                    style={{
                        marginBottom: "1rem"
                    }}>
                    <div>
                        <label htmlFor="sort-selector">{"Sort by: "}</label>
                        <select
                            id="sort-selector"
                            value={sort}
                            onChange={e => {
                                const value = e.target.value as SortKey
                                setSort(value)
                                setParam("sort", value)
                            }}>
                            <option value="kills">Kills</option>
                            <option value="usage">Usage</option>
                        </select>
                    </div>
                    <div>
                        <Flex as="nav" $align="flex-start" $padding={0} id="slot-nav">
                            <label htmlFor="slot-nav">{"Quick jump: "}</label>
                            <Link href="#kinetic">Kinetic</Link>
                            <Link href="#energy">Energy</Link>
                            <Link href="#power">Power</Link>
                        </Flex>
                    </div>
                </div>
                <WeaponTables sort={sort} count={count} />
            </div>
        </div>
    )
}
