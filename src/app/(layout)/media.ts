"use client"

import { css } from "styled-components"
import { o } from "~/util/o"
import { deviceSizes } from "./theme"

export const $media = {
    min: queries("min"),
    max: queries("max")
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
