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
            ref,
            close: () => {
                ref.current?.close()
            },
            open: () => {
                ref.current?.showModal()
            },
            Dialog: ({
                children,
                ...props
            }: ComponentPropsWithoutRef<typeof Dialog> & {
                onClose?: () => void
            }) => (
                <Dialog {...props} ref={ref}>
                    {children}
                </Dialog>
            )
        }),
        []
    )
}

const Dialog = forwardRef<
    HTMLDialogElement,
    ComponentPropsWithoutRef<"dialog"> & {
        onClose?: () => void
    }
>(({ children, onClick, onClose, ...props }, ref) => {
    const _onClick: MouseEventHandler<HTMLDialogElement> = useCallback(
        event => {
            if (typeof ref === "object" && ref?.current)
                if (ref.current.contains(event.target as Node)) {
                    const dialogRect = ref.current.getBoundingClientRect()

                    if (
                        event.clientX < dialogRect.left ||
                        event.clientX > dialogRect.right ||
                        event.clientY < dialogRect.top ||
                        event.clientY > dialogRect.bottom
                    ) {
                        onClose?.()
                        ref.current.close()
                    }
                } else {
                    onClose?.()
                    ref.current.close()
                }
        },
        [onClose, ref]
    )

    return (
        <dialog
            {...props}
            ref={ref}
            onClick={e => {
                onClick?.(e)
                _onClick(e)
            }}>
            <div
                style={{
                    top: 0,
                    position: "sticky",
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                <button onClick={() => typeof ref === "object" && ref?.current?.close()}>X</button>
            </div>
            {children}
        </dialog>
    )
})

Dialog.displayName = "Dialog"
