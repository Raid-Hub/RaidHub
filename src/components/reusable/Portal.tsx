import React from "react"
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

export const usePortal = () => React.useContext(PortalContext)

export function PortalProvider({
    children,
    target
}: {
    children: React.ReactNode
    target: HTMLElement | null
}) {
    const sendThroughPortal = React.useCallback(
        (node: React.ReactNode) => {
            if (typeof document !== "undefined" && target) {
                return ReactDOM.createPortal(node, target)
            }
        },
        [target]
    )
    return (
        <PortalContext.Provider
            value={{
                sendThroughPortal
            }}>
            {children}
        </PortalContext.Provider>
    )
}
