import {
    createContext,
    useCallback,
    useContext,
    type ReactNode,
    type ReactPortal,
    type RefObject
} from "react"
import { createPortal } from "react-dom"

const PortalContext = createContext<{
    portal: (node: ReactNode) => ReactPortal | null
} | null>(null)

export const usePortal = () => {
    const ctx = useContext(PortalContext)
    if (!ctx) throw Error("This hook must be used inside the PortalProvider")
    return ctx.portal
}

export function PortalProvider({
    children,
    target
}: {
    children: ReactNode
    target: RefObject<HTMLElement>
}) {
    const portal = useCallback(
        (node: React.ReactNode) => {
            if (target?.current) {
                // @ts-expect-error I don't know why create portal wont accept ReactNode
                return createPortal(node, target.current)
            } else {
                return null
            }
        },
        [target]
    )

    return (
        <PortalContext.Provider
            value={{
                // @ts-expect-error I don't know why create portal wont accept ReactNode
                portal
            }}>
            {children}
        </PortalContext.Provider>
    )
}
