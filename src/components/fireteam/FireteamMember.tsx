import styles from "~/styles/pages/fireteam.module.css"
import { useLiveData } from "~/hooks/bungie/useLiveData"
import { FireTeamMember } from "~/types/profile"
import { findArmorInBucket, findWeaponInBucket } from "~/util/destiny/weapons"
import PlayerItem from "./PlayerItem"
import Loading from "../global/Loading"

export default function FireteamMember({
    member,
    remove
}: {
    member: FireTeamMember
    remove: () => void
}) {
    const { data, isLoading } = useLiveData(member)
    const items = data?.characterEquipment.data?.[data.mostRecentCharacterId].items
    const sockets = data?.itemComponents.sockets.data

    const kinetic = findWeaponInBucket(items ?? [], "kinetic")
    const energy = findWeaponInBucket(items ?? [], "energy")
    const power = findWeaponInBucket(items ?? [], "power")

    const helmet = findArmorInBucket(items ?? [], "helmet")
    const arms = findArmorInBucket(items ?? [], "arms")
    const chest = findArmorInBucket(items ?? [], "chest")
    const legs = findArmorInBucket(items ?? [], "legs")
    const classItem = findArmorInBucket(items ?? [], "classItem")

    if (isLoading) return <Loading wrapperClass={styles["player"]} />
    return data ? (
        <div className={styles["player"]}>
            <button className={styles["remove-btn"]} onClick={remove}>
                X
            </button>
            <h2>{data.profile.data?.userInfo.bungieGlobalDisplayName}</h2>
            {sockets && (
                <div className={styles["items"]}>
                    {kinetic?.itemInstanceId && (
                        <PlayerItem
                            item={kinetic}
                            sockets={sockets[kinetic.itemInstanceId].sockets}
                        />
                    )}
                    {energy?.itemInstanceId && (
                        <PlayerItem
                            item={energy}
                            sockets={sockets[energy.itemInstanceId].sockets}
                        />
                    )}
                    {power?.itemInstanceId && (
                        <PlayerItem item={power} sockets={sockets[power.itemInstanceId].sockets} />
                    )}
                    {helmet?.itemInstanceId && (
                        <PlayerItem
                            item={helmet}
                            sockets={sockets[helmet.itemInstanceId].sockets}
                        />
                    )}
                    {arms?.itemInstanceId && (
                        <PlayerItem item={arms} sockets={sockets[arms.itemInstanceId].sockets} />
                    )}
                    {chest?.itemInstanceId && (
                        <PlayerItem item={chest} sockets={sockets[chest.itemInstanceId].sockets} />
                    )}
                    {legs?.itemInstanceId && (
                        <PlayerItem item={legs} sockets={sockets[legs.itemInstanceId].sockets} />
                    )}
                    {classItem?.itemInstanceId && (
                        <PlayerItem
                            item={classItem}
                            sockets={sockets[classItem.itemInstanceId].sockets}
                        />
                    )}
                </div>
            )}
        </div>
    ) : (
        <></>
    )
}
