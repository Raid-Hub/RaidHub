import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { useOptimisticProfileUpdate } from "./useOptimisticProfileUpdate"
import { trpc } from "~/util/trpc"

const defaultEditInput = "black"

export function useProfileDecoration(ref: RefObject<HTMLElement>) {
    const { data: raidHubProfile } = trpc.user.getProfile.useQuery()
    const [isEditing, setIsEditing] = useState(false)
    const [inputStyling, setInputStyling] = useState<string>("")
    const { mutate: mutateProfile } = useOptimisticProfileUpdate()

    useEffect(() => {
        if (ref.current) {
            ref.current.style.cssText =
                "background: " +
                inputStyling
                    .split(";")
                    .filter(Boolean)
                    .map(
                        line =>
                            line.replace("background-image: ", "").replace("background: ", "") ??
                            "".replace("\n: ", "").replace(/;$/, "")
                    )[0]
        }
    }, [inputStyling, ref.current])

    useEffect(() => {
        setInputStyling(raidHubProfile?.profileDecoration ?? defaultEditInput)
    }, [raidHubProfile?.profileDecoration])

    const handleEditorInputSave = useCallback(() => {
        mutateProfile({
            profileDecoration: inputStyling
        })
        setIsEditing(false)
    }, [inputStyling, mutateProfile])

    return {
        isEditing,
        handleStartEditing: () => setIsEditing(true),
        handleCancel: () => setIsEditing(false),
        handleEditorInputSave,
        setInputStyling,
        inputStyling,
        handleReset: () => setInputStyling(raidHubProfile?.profileDecoration ?? defaultEditInput)
    }
}
