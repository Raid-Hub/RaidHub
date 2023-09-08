import styles from "~/styles/pages/fireteam.module.css"
import { useLiveData } from "~/hooks/bungie/useLiveData"
import { FireTeamMember } from "~/types/profile"
import { findArmorInBucket, findWeaponInBucket } from "~/util/destiny/weapons"
import Weapon from "./Weapon"

export default function FireteamMember({ member }: { member: FireTeamMember }) {
    const { data } = useLiveData(member)
    const items = data?.characterEquipment.data?.[data.mostRecentCharacterId].items

    const kinetic = findWeaponInBucket(items ?? [], "kinetic")
    const energy = findWeaponInBucket(items ?? [], "energy")
    const power = findWeaponInBucket(items ?? [], "power")

    const helmet = findArmorInBucket(items ?? [], "helmet")
    const arms = findArmorInBucket(items ?? [], "arms")
    const chest = findArmorInBucket(items ?? [], "chest")
    const legs = findArmorInBucket(items ?? [], "legs")
    const classItem = findArmorInBucket(items ?? [], "classItem")

    return data ? (
        <div className={styles["player"]}>
            <h2>{data.profile.data?.userInfo.bungieGlobalDisplayName}</h2>
            <div className={styles["weapons"]}>
                {kinetic && <Weapon item={kinetic} />}
                {energy && <Weapon item={energy} />}
                {power && <Weapon item={power} />}
            </div>
        </div>
    ) : null
}
