import Image from "next/image"
import { Pin } from "../../images/icons"
import { useLocale } from "../app/LocaleManager"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"
import DestinyPGCR from "~/models/pgcr/PGCR"
import { useOptimisticProfileUpdate } from "~/hooks/raidhub/useOptimisticProfileUpdate"

const PinPCRCell = () => {
    const { strings } = useLocale()
    const { pgcr } = usePGCRContext()
    const { mutate, data: profile } = useOptimisticProfileUpdate()

    const handlePinClick = (pgcr: DestinyPGCR) =>
        mutate({
            pinnedActivityId: pgcr.activityDetails.instanceId
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
