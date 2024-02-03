export type Flatten<T> = T extends ReadonlyArray<infer U> ? U : never
export type FilterCallback<T> = (value: T) => boolean
export type AtLeast<T, K extends keyof T> = T & Required<Pick<T, K>>
