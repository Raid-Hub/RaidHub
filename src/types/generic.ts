export type Flatten<T> = T extends ReadonlyArray<infer U> ? U : never
export type AtLeast<T, K extends keyof T> = T & Required<Pick<T, K>>
export type ErrorBoundaryProps = {
    error: Error & { digest?: string }
    reset: () => void
}

export type Prettify<T> = {
    [K in keyof T]: T[K]
    // eslint-disable-next-line @typescript-eslint/ban-types
} & {}

export type Truthy<T> = T extends null | undefined | false | "" | 0 ? never : T

export type KeysWhichValuesExtend<Keys, Schema> = keyof {
    [key in keyof Keys as Keys[key] extends Schema ? key : never]: Keys[key]
}

export interface RGBA {
    blue: number
    green: number
    red: number
    alpha: number
}
