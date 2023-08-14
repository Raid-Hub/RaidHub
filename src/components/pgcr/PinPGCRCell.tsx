import Image from "next/image"
import { Pin } from "../../images/icons"
import { useLocale } from "../app/LocaleManager"
import { useRaidHubProfileMutation } from "../../hooks/raidhub/useRaidHubProfileMutation"

const PinPCRCell = ({ destinyMembershipId }: { destinyMembershipId: string }) => {
    const { strings } = useLocale()
    const x = useRaidHubProfileMutation(destinyMembershipId)
    const handlePinClick = () => {
        x.mutate({
            pinnedActivityId: ""
        })
    }

    return (
        <div>
            <span>{strings.pinThisActivity}</span>
            <div
                style={{ width: "50%", position: "relative", cursor: "pointer" }}
                onClick={handlePinClick}>
                <Image
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
