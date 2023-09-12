import { RefObject, useCallback, useEffect, useState } from "react"
import { useOptimisticProfileUpdate } from "./useOptimisticProfileUpdate"
import { trpc } from "~/util/trpc"
import { useSession } from "next-auth/react"

const defaultEditInput = "black"

export function useProfileDecoration(ref: RefObject<HTMLElement>) {
    const { status } = useSession()
    const { data: raidHubProfile } = trpc.user.getProfile.useQuery(undefined, {
        enabled: status === "authenticated"
    })
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
    }, [inputStyling, ref])

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
