import {
    createContext,
    useCallback,
    useContext,
    type ReactNode,
    type ReactPortal,
    type RefObject
} from "react"
import { createPortal } from "react-dom"

const PortalContext = createContext<(node: ReactNode) => ReactPortal | null>((node: ReactNode) => {
    if (document?.body) {
        // @ts-expect-error I don't know why create portal wont accept ReactNode
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
    children: ReactNode
    target: RefObject<HTMLElement>
}) => (
    <PortalContext.Provider
        value={useCallback(
            (node: ReactNode) => {
                if (target?.current) {
                    // @ts-expect-error I don't know why create portal wont accept ReactNode
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
