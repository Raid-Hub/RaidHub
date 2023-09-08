import styles from "~/styles/pages/fireteam.module.css"
import Image from "next/image"
import { DestinyItemComponent } from "bungie-net-core/models"
import { useLiveData } from "~/hooks/bungie/useLiveData"
import { FireTeamMember } from "~/types/profile"
import { useWeapon } from "../app/DestinyManifestManager"
import { weaponBuckets } from "~/util/destiny/weapons"
import { Question_Mark } from "~/images/icons"

export default function FireteamMember({ member }: { member: FireTeamMember }) {
    const { data } = useLiveData(member)
    return data ? (
        <div className={styles["player"]}>
            <h2>{data.profile.data?.userInfo.bungieGlobalDisplayName}</h2>
            {data?.characterEquipment.data?.[data.mostRecentCharacterId].items
                .filter(item => weaponBuckets.includes(item.bucketHash))
                .map((item, idx) => (
                    <Idk key={idx} item={item} />
                ))}
        </div>
    ) : null
}

function Idk({ item }: { item: DestinyItemComponent }) {
    const { data: weapon } = useWeapon(item.itemHash)
    return (
        <Image
            unoptimized
            src={weapon?.icon ? `https://www.bungie.net${weapon.icon}` : Question_Mark}
            alt={weapon?.name ?? ""}
            width={96}
            height={96}
        />
    )
}
