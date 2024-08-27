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
    useEventListener(
        "keydown",
        (event: KeyboardEvent) => {
            if ((!ctrlOrMeta || event.metaKey || event.ctrlKey) && event.key === pressedKey) {
                if (preventDefault) event.preventDefault()
                handleEvent()
            }
        },
        {
            disabled
        }
    )
}
