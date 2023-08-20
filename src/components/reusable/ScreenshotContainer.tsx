import html2canvas, { Options } from "html2canvas"
import {
    ReactNode,
    RefObject,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react"

type CanvasOptions = Partial<Options> | undefined

const ScreenshotContext = createContext<{
    childRef: RefObject<HTMLElement> | null
    options: CanvasOptions
}>({
    childRef: null,
    options: undefined
})

export const useScreenshot = ({
    onSuccess,
    onFailure
}: {
    onSuccess?: (blob: Blob) => void
    onFailure?: () => void
}) => {
    const { childRef, options } = useContext(ScreenshotContext)
    const takeScreenshot = async () => {
        const element = childRef?.current
        if (!element) return

        try {
            const canvas = await html2canvas(element, options)

            canvas.toBlob(async blob => {
                if (blob) {
                    onSuccess?.(blob)
                } else {
                    onFailure?.()
                }
            })
        } catch (e) {
            console.error(e)
            onFailure?.()
        }
    }
    return { takeScreenshot }
}

const ScreenshotContainer = ({
    childRef,
    options,
    children
}: {
    childRef: RefObject<HTMLElement>
    options: CanvasOptions
    children: ReactNode
}) => {
    return (
        <ScreenshotContext.Provider
            value={{
                childRef,
                options
            }}>
            {children}
        </ScreenshotContext.Provider>
    )
}

export default ScreenshotContainer
