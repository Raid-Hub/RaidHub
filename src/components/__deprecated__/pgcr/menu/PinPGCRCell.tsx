import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { trpc } from "~/app/trpc"
import PinIcon from "~/components/icons/PinIcon"
import { useOptimisticProfileUpdate } from "~/hooks/app/useOptimisticProfileUpdate"
import { useSession } from "~/hooks/app/useSession"

/** @deprecated */
const PinPCRCell = () => {
    const { activity } = usePGCRContext()

    const { status } = useSession()
    const { data: profile } = trpc.user.profile.get.useQuery(undefined, {
        enabled: status === "authenticated"
    })
    const { mutate: updateProfile } = useOptimisticProfileUpdate()

    const isPinned =
        typeof profile?.pinnedActivityId !== "undefined" &&
        profile.pinnedActivityId === activity?.instanceId

    const handlePinClick = () => {
        if (activity) {
            updateProfile({
                pinnedActivityId: isPinned ? null : activity.instanceId
            })
        }
    }

    return profile && activity ? (
        <div>
            <span style={{ whiteSpace: "nowrap" }}>{isPinned ? "Pin" : "Un-Pin"}</span>
            <button style={{ width: "50%", cursor: "pointer" }} onClick={() => handlePinClick()}>
                <PinIcon sx={20} color={isPinned ? "white" : "orange"} />
            </button>
        </div>
    ) : null
}

export default PinPCRCell
