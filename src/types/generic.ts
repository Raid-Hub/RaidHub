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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageStaticParams<T extends (...args: any[]) => Promise<Record<string, unknown>[]>> = {
    params: Awaited<ReturnType<T>>[number]
}

export type Truthy<T> = T extends null | undefined | false | "" | 0 ? never : T

export type KeysWhichValuesExtend<Keys, Schema> = keyof {
    [key in keyof Keys as Keys[key] extends Schema ? key : never]: Keys[key]
}
