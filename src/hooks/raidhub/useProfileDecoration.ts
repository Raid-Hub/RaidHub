import { RefObject, useCallback, useEffect, useState } from "react"
import { useOptimisticProfileUpdate } from "./useOptimisticProfileUpdate"
import { trpc } from "~/util/trpc"
import { useProfileProps } from "~/components/profile/Profile"

const defaultEditInput = ""

export function useProfileDecoration(ref: RefObject<HTMLElement>) {
    const { destinyMembershipId } = useProfileProps()
    const { data: raidHubProfile } = trpc.profile.byDestinyMembershipId.useQuery({
        destinyMembershipId
    })

    const [isEditing, setIsEditing] = useState(false)
    const [inputStyling, setInputStyling] = useState<string>("")
    const { mutate: mutateProfile } = useOptimisticProfileUpdate()

    useEffect(() => {
        if (ref.current) {
            ref.current.style.cssText = inputStyling
                ? "background: " +
                  inputStyling
                      .split(";")
                      .filter(Boolean)
                      .map(
                          line =>
                              line.replace("background-image: ", "").replace("background: ", "") ??
                              "".replace("\n: ", "").replace(/;$/, "")
                      )[0]
                : ""
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
