import Image from "next/image"
import { Pin } from "../../images/icons"
import { useLocale } from "../app/LocaleManager"
import { useRaidHubProfileMutation } from "../../hooks/raidhub/useRaidHubProfileMutation"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"
import { useSession } from "next-auth/react"

const PinPCRCell = ({ destinyMembershipId }: { destinyMembershipId: string }) => {
    const { strings } = useLocale()
    const { data: sessionData } = useSession()
    const { pgcr } = usePGCRContext()
    const { mutate } = useRaidHubProfileMutation(destinyMembershipId)

    const handlePinClick = () =>
        pgcr &&
        mutate({
            pinnedActivityId:
                sessionData?.user.destinyMembershipId !== pgcr.activityDetails.instanceId
                    ? pgcr.activityDetails.instanceId
                    : null
        })

    return (
        <div>
            <span>{strings.pinThisActivity}</span>
            <div
                style={{ width: "50%", position: "relative", cursor: "pointer" }}
                onClick={handlePinClick}>
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
    )
}

export default PinPCRCell
