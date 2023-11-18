import { NextPage } from "next"
import CustomError from "../models/errors/CustomError"
import { FunctionComponent, ReactNode } from "react"

export type Flatten<T> = T extends ReadonlyArray<infer U> ? U : never
export type ErrorHandler<R = void> = (error: CustomError) => R
export type FilterCallback<T> = (value: T) => boolean

export type CrawlableNextPage<P, IP> = NextPage<P, P | (IP & { headOnly: true })> & {
    Head: FunctionComponent<IP & { children: ReactNode }>
}
