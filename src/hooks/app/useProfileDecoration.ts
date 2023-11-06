import { RefObject, useCallback, useEffect, useState } from "react"
import { useOptimisticProfileUpdate } from "./useOptimisticProfileUpdate"
import { trpc } from "~/util/trpc"
import { useProfileProps } from "~/components/profile/Profile"

const defaultColor = "#FFFFFF"
const defaultOpacity = 255

export function useProfileDecoration(ref: RefObject<HTMLElement>) {
    const { destinyMembershipId } = useProfileProps()
    const { data: raidHubProfile } = trpc.profile.byDestinyMembershipId.useQuery({
        destinyMembershipId
    })

    const [isEditing, setIsEditing] = useState(false)
    const [color, setColor] = useState<string>(defaultColor)
    const [opacity, setOpacity] = useState<number>(255)
    const { mutate: mutateProfile } = useOptimisticProfileUpdate()

    const styling = color + percentToHex(opacity)

    useEffect(() => {
        if (ref.current) {
            if (color) {
                ref.current.style.cssText = `background-color: ${styling}`
            } else {
                ref.current.style.cssText = ""
            }
        }
    }, [color, styling, ref])

    const handleEditorInputSave = () => {
        mutateProfile({
            profileDecoration: styling
        })
        setIsEditing(false)
    }

    const handleDecorationChange = useCallback(() => {
        if (raidHubProfile?.profileDecoration) {
            setColor(raidHubProfile.profileDecoration.substring(0, 7))
            setOpacity(parseInt(raidHubProfile.profileDecoration.substring(7), 16))
        } else {
            setColor(defaultColor)
            setOpacity(defaultOpacity)
        }
    }, [raidHubProfile?.profileDecoration])

    useEffect(() => {
        handleDecorationChange()
    }, [handleDecorationChange])

    return {
        isEditing,
        handleStartEditing: () => setIsEditing(true),
        handleCancel: () => {
            setIsEditing(false)
            handleDecorationChange()
        },
        handleEditorInputSave,
        setColor,
        setOpacity,
        color,
        opacity,
        handleReset: handleDecorationChange
    }
}

function percentToHex(decimalValue: number) {
    const hexValue = decimalValue.toString(16).padStart(2, "0")
    return hexValue.toUpperCase()
}
