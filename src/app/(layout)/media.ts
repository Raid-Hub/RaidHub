"use client"

import { css } from "styled-components"
import { o } from "~/util/o"
import { deviceSizes } from "./theme"

const deviceMediaQuery = <T extends keyof typeof deviceSizes>(
    dir: "min" | "max",
    device: T,
    value: TemplateStringsArray,
    ...values: (string | ((dimensions: (typeof deviceSizes)[T]) => string | number))[]
) => css`
    @media (${dir}-width: ${deviceSizes[device][dir]}) {
        ${String.raw(
            value,
            ...values.map(val => (typeof val === "function" ? val(deviceSizes[device]) : val))
        )}
    }
`
const queries = (dir: "min" | "max") =>
    o.mapValuesByKey(deviceSizes, k => deviceMediaQuery.bind(null, dir, k))

export const $media = {
    min: queries("min"),
    max: queries("max")
}
