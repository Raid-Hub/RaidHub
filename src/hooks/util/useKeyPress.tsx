import { useEffect } from "react"

type AvailableKeys = "k" | "Escape" // can expand if needed

export const useKeyPress = ({
    ctrlOrMeta,
    preventDefault,
    pressedKey,
    disabled,
    handleEvent
}: {
    ctrlOrMeta?: boolean
    preventDefault?: boolean
    disabled?: boolean
    pressedKey: AvailableKeys
    handleEvent: () => void
}) => {
    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if ((!ctrlOrMeta || event.metaKey || event.ctrlKey) && event.key === pressedKey) {
                if (preventDefault) event.preventDefault()
                handleEvent()
            }
        }

        if (!disabled) document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [disabled, pressedKey, ctrlOrMeta, preventDefault, handleEvent])
}
