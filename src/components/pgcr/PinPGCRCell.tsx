import Image from "next/image"
import { Pin } from "~/images/icons"
import { useLocale } from "../app/LocaleManager"
import { usePGCRContext } from "~/pages/pgcr/[activityId]"
import { useOptimisticProfileUpdate } from "~/hooks/raidhub/useOptimisticProfileUpdate"
import { trpc } from "~/util/trpc"
import { useSession } from "next-auth/react"

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

    return profile && pgcr ? (
        <div>
            <span>{isPinned ? strings.pinToProfile : strings.unPinFromProfile}</span>
            <button
                style={{ width: "50%", position: "relative", cursor: "pointer" }}
                onClick={() => handlePinClick()}>
                <Image
                    width={20}
                    height={20}
                    src={Pin}
                    alt={isPinned ? strings.pinToProfile : strings.unPinFromProfile}
                    style={{ objectFit: "contain" }}
                />
            </button>
        </div>
    ) : null
}

export default PinPCRCell
