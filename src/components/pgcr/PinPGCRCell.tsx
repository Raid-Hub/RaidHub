import Image from "next/image"
import { Pin } from "../../images/icons"
import { useLocale } from "../app/LocaleManager"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"
import DestinyPGCR from "~/models/pgcr/PGCR"
import { useOptimisticProfileUpdate } from "~/hooks/raidhub/useOptimisticProfileUpdate"
import { trpc } from "~/util/trpc"
import { useSession } from "next-auth/react"

const PinPCRCell = () => {
    const { data: pgcr } = usePGCRContext()
    const { status } = useSession()
    const { data: profile } = trpc.user.getProfile.useQuery(undefined, {
        enabled: status === "authenticated"
    })
    const { mutate: updateProfile } = useOptimisticProfileUpdate()

    const handlePinClick = (pgcr: DestinyPGCR) =>
        updateProfile({
            pinnedActivityId:
                profile?.pinnedActivityId !== pgcr.activityDetails.instanceId
                    ? pgcr.activityDetails.instanceId
                    : null
        })

    const { strings } = useLocale()

    return profile && pgcr ? (
        <div>
            <span>{strings.pinThisActivity}</span>
            <div
                style={{ width: "50%", position: "relative", cursor: "pointer" }}
                onClick={() => handlePinClick(pgcr)}>
                <Image
                    width={15}
                    height={15}
                    src={Pin}
                    alt={strings.pinThisActivity}
                    fill
                    style={{ objectFit: "contain" }}
                />
            </div>
        </div>
    ) : null
}

export default PinPCRCell
