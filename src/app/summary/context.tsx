"use client"

import { createContext, useContext } from "react"

export const SummaryContext = createContext<Set<string> | null>(null)

export const useSelectedPlayers = () => {
    const context = useContext(SummaryContext)
    if (!context) {
        throw new Error("useSelectedPlayers must be used within a SummaryContext.Provider")
    }
    return context
}
