import { useLocale } from "../../app/LocaleManager"
import { usePGCRContext } from "../PGCR"
import { useOptimisticProfileUpdate } from "~/hooks/app/useOptimisticProfileUpdate"
import { trpc } from "~/util/trpc"
import { useSession } from "next-auth/react"
import PinIcon from "~/images/icons/PinIcon"

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

    const { strings } = useLocale()

    return profile && pgcr?.activityDetails.mode == 4 ? (
        <div>
            <span>{isPinned ? strings.pinToProfile : strings.unPinFromProfile}</span>
            <button style={{ width: "50%", cursor: "pointer" }} onClick={() => handlePinClick()}>
                <PinIcon sx={20} color={isPinned ? "white" : "orange"} />
            </button>
        </div>
    ) : null
}

export default PinPCRCell
