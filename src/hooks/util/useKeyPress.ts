import { useCallback } from "react"
import { useEventListener } from "./useEventListener"

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
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if ((!ctrlOrMeta || event.metaKey || event.ctrlKey) && event.key === pressedKey) {
                if (preventDefault) event.preventDefault()
                handleEvent()
            }
        },
        [ctrlOrMeta, preventDefault, pressedKey, handleEvent]
    )

    useEventListener("keydown", handleKeyDown, {
        disabled
    })
}
