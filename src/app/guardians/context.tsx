import { createContext, useContext } from "react"

export const ExpandedContext = createContext<boolean | null>(null)

export function useExpandedContext() {
    const ctx = useContext(ExpandedContext)
    if (ctx === null) throw new Error("Cannot use ExpandedContext outside of its provider")
    return ctx
}
