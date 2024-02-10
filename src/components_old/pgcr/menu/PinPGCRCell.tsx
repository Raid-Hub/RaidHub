import { useOptimisticProfileUpdate } from "~/hooks/app/useOptimisticProfileUpdate"
import { useSession } from "~/hooks/app/useSession"
import PinIcon from "~/images/icons/PinIcon"
import { trpc } from "~/util/trpc"
import { usePGCRContext } from "../PGCR"

const PinPCRCell = () => {
    const { data: pgcr } = usePGCRContext()
    const { status } = useSession()
    const { data: profile } = trpc.user.profile.get.useQuery(undefined, {
        enabled: status === "authenticated"
    })
    const { mutate: updateProfile } = useOptimisticProfileUpdate()

    const isPinned = profile?.pinnedActivityId !== pgcr?.activityDetails.instanceId

    const handlePinClick = () =>
        updateProfile({
            pinnedActivityId: isPinned ? pgcr!.activityDetails.instanceId : null
        })

    return profile && pgcr?.activityDetails.mode == 4 ? (
        <div>
            <span>{isPinned ? "Pin" : "Un-Pin"}</span>
            <button style={{ width: "50%", cursor: "pointer" }} onClick={() => handlePinClick()}>
                <PinIcon sx={20} color={isPinned ? "white" : "orange"} />
            </button>
        </div>
    ) : null
}

export default PinPCRCell
