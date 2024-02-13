"use client"

import { useEffect, useState } from "react"
import { css } from "styled-components"
import { o } from "~/util/o"
import { deviceSizes } from "./theme"

export const $media = {
    min: queries("min"),
    max: queries("max")
}

export const useMediaQuery = (dir: keyof typeof $media, prop: keyof typeof deviceSizes) => {
    const [matches, setMatches] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        const query = `(${dir}-width: ${deviceSizes[prop][dir]})`
        const mediaQueryList = window.matchMedia(query)
        // initial value
        setMatches(mediaQueryList.matches)

        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        mediaQueryList.addEventListener("change", handleChange)

        return () => {
            mediaQueryList.removeEventListener("change", handleChange)
        }
    }, [prop, dir])

    return matches
}

function queries(dir: "min" | "max") {
    return o.mapValuesByKey(deviceSizes, k => deviceMediaQuery.bind(null, dir, k))
}

function deviceMediaQuery<T extends keyof typeof deviceSizes>(
    dir: "min" | "max",
    device: T,
    value: TemplateStringsArray,
    ...values: ((dimensions: (typeof deviceSizes)[T]) => string | number)[]
) {
    const inner = String.raw(value, ...values.map(fn => fn(deviceSizes[device])))
    return css`
        @media (${dir}-width: ${deviceSizes[device][dir]}) {
            ${inner}
        }
    `
}
