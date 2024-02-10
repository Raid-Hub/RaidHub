"use client"

import { ReactNode, createContext, useContext, useState } from "react"
import BungieClient from "~/services/bungie/BungieClient"

const BungieClientContext = createContext<BungieClient | undefined>(undefined)

export const BungieClientProvider = (props: { children: ReactNode }) => {
    const [bungieClient] = useState(() => new BungieClient())
    return (
        <BungieClientContext.Provider value={bungieClient}>
            {props.children}
        </BungieClientContext.Provider>
    )
}

export const useBungieClient = () => {
    const ctx = useContext(BungieClientContext)
    if (!ctx) throw Error("Cannot use useBungieClient outside a child of BungieTokenManager")
    return ctx
}
