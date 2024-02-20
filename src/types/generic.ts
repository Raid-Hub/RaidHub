export type Flatten<T> = T extends ReadonlyArray<infer U> ? U : never
export type FilterCallback<T> = (value: T) => boolean
export type AtLeast<T, K extends keyof T> = T & Required<Pick<T, K>>
export type ErrorBoundaryProps = {
    error: Error & { digest?: string }
    reset: () => void
}

export type Prettify<T> = {
    [K in keyof T]: T[K]
    // eslint-disable-next-line @typescript-eslint/ban-types
} & {}
