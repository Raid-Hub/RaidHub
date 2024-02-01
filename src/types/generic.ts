export type Flatten<T> = T extends ReadonlyArray<infer U> ? U : never
export type FilterCallback<T> = (value: T) => boolean
