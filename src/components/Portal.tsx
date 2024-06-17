import { createContext, useCallback, useContext, type RefObject } from "react"
import { createPortal } from "react-dom"

type ReactDOMReactNode = Parameters<typeof createPortal>[0]

const PortalContext = createContext((node: ReactDOMReactNode) => {
    if (document?.body) {
        return createPortal(node, document.body)
    } else {
        return null
    }
})

export const usePortal = () => useContext(PortalContext)

export const PortalProvider = ({
    children,
    target
}: {
    children: React.ReactNode
    target: RefObject<HTMLElement>
}) => (
    <PortalContext.Provider
        value={useCallback(
            (node: ReactDOMReactNode) => {
                if (target?.current) {
                    return createPortal(node, target.current)
                } else {
                    return null
                }
            },
            [target]
        )}>
        {children}
    </PortalContext.Provider>
)
