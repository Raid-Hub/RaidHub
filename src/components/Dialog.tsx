import {
    forwardRef,
    useCallback,
    useMemo,
    useRef,
    type ComponentPropsWithoutRef,
    type MouseEventHandler
} from "react"

export const useDialog = () => {
    const ref = useRef<HTMLDialogElement>(null)

    return useMemo(
        () => ({
            close: () => {
                ref.current?.close()
            },
            open: () => {
                ref.current?.showModal()
            },
            Dialog: ({ children, ...props }: ComponentPropsWithoutRef<typeof Dialog>) => (
                <Dialog {...props} ref={ref}>
                    {children}
                </Dialog>
            )
        }),
        []
    )
}

const Dialog = forwardRef<HTMLDialogElement, ComponentPropsWithoutRef<"dialog">>(
    ({ children, onClick, style, ...props }, ref) => {
        const _onClick: MouseEventHandler<HTMLDialogElement> = useCallback(
            event => {
                if (typeof ref === "object" && ref?.current?.contains(event.target as Node)) {
                    const dialogRect = ref.current.getBoundingClientRect()

                    if (
                        event.clientX < dialogRect.left ||
                        event.clientX > dialogRect.right ||
                        event.clientY < dialogRect.top ||
                        event.clientY > dialogRect.bottom
                    ) {
                        ref.current.close()
                    }
                }
            },
            [ref]
        )

        return (
            <dialog
                {...props}
                ref={ref}
                onClick={e => {
                    onClick?.(e)
                    _onClick(e)
                }}
                style={{ ...style, position: "relative" }}>
                <button
                    onClick={() => typeof ref === "object" && ref?.current?.close()}
                    style={{
                        position: "absolute",
                        right: "0.5rem",
                        top: "0.5rem"
                    }}>
                    X
                </button>
                {children}
            </dialog>
        )
    }
)

Dialog.displayName = "Dialog"
