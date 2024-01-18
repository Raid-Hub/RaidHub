import CustomError from "../models/errors/CustomError"

export type Flatten<T> = T extends ReadonlyArray<infer U> ? U : never
export type ErrorHandler<R = void> = (error: CustomError) => R
export type FilterCallback<T> = (value: T) => boolean
