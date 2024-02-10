import React, { RefObject } from "react"
import ReactDOM from "react-dom"

const PortalContext = React.createContext<{
    sendThroughPortal: (node: React.ReactNode) => React.ReactPortal | undefined
}>({
    sendThroughPortal(node) {
        if (typeof document !== "undefined") {
            return ReactDOM.createPortal(node, document.getElementById("__next")!)
        }
    }
})

/**
 * @deprecated
 */
export const usePortal = () => React.useContext(PortalContext)

/**
 * @deprecated
 */
export function PortalProvider({
    children,
    target
}: {
    children: React.ReactNode
    target: RefObject<HTMLElement>
}) {
    const sendThroughPortal = (node: React.ReactNode) => {
        if (typeof document !== "undefined" && target?.current) {
            return ReactDOM.createPortal(node, target.current)
        }
    }
    return (
        <PortalContext.Provider
            value={{
                sendThroughPortal
            }}>
            {children}
        </PortalContext.Provider>
    )
}
