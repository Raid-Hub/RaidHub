import Image from "next/image"
import { Pin } from "../../images/icons"
import { useLocale } from "../app/LocaleManager"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"
import { useSession } from "next-auth/react"
import { trpc } from "~/util/trpc"
import DestinyPGCR from "~/models/pgcr/PGCR"

const PinPCRCell = () => {
    const { strings } = useLocale()
    const { data: sessionData } = useSession()
    const { pgcr } = usePGCRContext()
    const { mutate, data: profile } = trpc.user.updateProfile.useMutation()

    const handlePinClick = (pgcr: DestinyPGCR) =>
        mutate({
            pinnedActivityId:
                sessionData?.user.destinyMembershipId !== pgcr.activityDetails.instanceId
                    ? pgcr.activityDetails.instanceId
                    : null
        })

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
