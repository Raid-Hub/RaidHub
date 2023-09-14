import styles from "~/styles/pages/inpsect.module.css"
import { findArmorInBucket, findWeaponInBucket } from "~/util/destiny/itemUtils"
import PlayerItem from "./PlayerItem"
import Loading from "../global/Loading"
import PlayerHeader from "./PlayerHeader"
import { useBungieClient } from "../app/TokenManager"
import { ReactNode, useEffect, useMemo } from "react"
import { InpsectionMemberData } from "~/types/profile"
import { isPrimaryCrossSave } from "~/util/destiny/crossSave"
import { DestinyProfileUserInfoCard } from "bungie-net-core/models"
import Loader from "../reusable/Loader"
import { subclassBucket } from "~/data/inventory-item-buckets"

export default function Player({
    member,
    remove,
    addMembers
}: {
    member: InpsectionMemberData
    remove: () => void
    addMembers: (members: InpsectionMemberData[]) => void
}) {
    const bungie = useBungieClient()
    const { data: linkedProfiles } = bungie.linkedProfiles.useQuery(member, {
        staleTime: Infinity
    })
    const primaryProfile = useMemo(
        () => linkedProfiles?.profiles.find(p => isPrimaryCrossSave(p, member.membershipId)),
        [linkedProfiles]
    )

    return primaryProfile ? (
        <ResolvedPlayer primaryProfile={primaryProfile} member={member} addMembers={addMembers}>
            <button className={styles["remove-btn"]} onClick={remove}>
                X
            </button>
        </ResolvedPlayer>
    ) : (
        <Loading className={styles["player"]} />
    )
}

function ResolvedPlayer({
    primaryProfile,
    member,
    addMembers,
    children
}: {
    primaryProfile: DestinyProfileUserInfoCard
    member: InpsectionMemberData
    addMembers: (members: InpsectionMemberData[]) => void
    children: ReactNode
}) {
    const bungie = useBungieClient()
    const { data, isLoading, isRefetching } = bungie.profile.useQuery(
        {
            membershipType: primaryProfile.membershipType,
            destinyMembershipId: primaryProfile.membershipId
        },
        {
            refetchOnWindowFocus: true,
            staleTime: 20000
        }
    )

    useEffect(() => {
        if (member.isFireteamIncluded && data?.profileTransitoryData.data?.partyMembers) {
            addMembers(
                data.profileTransitoryData.data.partyMembers.map(pm => ({
                    membershipId: pm.membershipId,
                    isFireteamIncluded: false
                }))
            )
        }
    }, [addMembers, data, member.isFireteamIncluded])

    const mostRecentCharacterId = useMemo(
        () =>
            data?.characters.data
                ? Object.values(data.characters.data).reduce((base, current) =>
                      new Date(current.dateLastPlayed).getTime() >
                      new Date(base.dateLastPlayed).getTime()
                          ? current
                          : base
                  ).characterId
                : null,
        [data]
    )

    const items = mostRecentCharacterId
        ? data?.characterEquipment.data?.[mostRecentCharacterId].items
        : undefined
    const sockets = data?.itemComponents.sockets.data

    const subclass = items?.find(i => i.bucketHash === subclassBucket)

    const kinetic = findWeaponInBucket(items ?? [], "kinetic")
    const energy = findWeaponInBucket(items ?? [], "energy")
    const power = findWeaponInBucket(items ?? [], "power")

    const helmet = findArmorInBucket(items ?? [], "helmet")
    const arms = findArmorInBucket(items ?? [], "arms")
    const chest = findArmorInBucket(items ?? [], "chest")
    const legs = findArmorInBucket(items ?? [], "legs")
    const classItem = findArmorInBucket(items ?? [], "classItem")

    if (isLoading) return <Loading className={styles["player"]} />
    return data ? (
        <div className={styles["player"]}>
            {data.profile.data && data.characters.data && (
                <PlayerHeader profile={data.profile.data} characters={data.characters.data} />
            )}
            {children}
            {isRefetching && (
                <div className={styles["loader-container"]}>
                    <Loader />
                </div>
            )}
            {sockets && (
                <div className={styles["items"]}>
                    {subclass?.itemInstanceId && (
                        <PlayerItem
                            item={subclass}
                            sockets={sockets[subclass.itemInstanceId].sockets}
                        />
                    )}
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
    ) : null
}
