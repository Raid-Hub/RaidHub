import { DestinyProfileUserInfoCard } from "bungie-net-core/models"
import { ReactNode, useMemo } from "react"
import { Loader } from "~/components/Loader"
import { Loading } from "~/components/Loading"
import { subclassBucket } from "~/data/inventory-item-buckets"
import { useLinkedProfiles } from "~/services/bungie/useLinkedProfiles"
import { useProfile } from "~/services/bungie/useProfile"
import { useProfileTransitory } from "~/services/bungie/useProfileTransitory"
import { isPrimaryCrossSave } from "~/util/destiny/crossSave"
import { findArmorInBucket, findWeaponInBucket } from "~/util/destiny/itemUtils"
import { useBungieClient } from "../../app/managers/BungieTokenManager"
import PlayerHeader from "./PlayerHeader"
import PlayerItem from "./PlayerItem"
import styles from "./guardians.module.css"

export default function Player({
    membershipId,
    remove,
    isFireteamIncluded,
    add
}: {
    membershipId: string
    isFireteamIncluded: boolean
    remove: () => void
    add: (membershipId: string, isFireteamIncluded: boolean) => void
}) {
    const { data: linkedProfiles } = useLinkedProfiles({
        membershipId: membershipId
    })

    const primaryProfile = useMemo(
        () => linkedProfiles?.profiles.find(p => isPrimaryCrossSave(p, membershipId)),
        [linkedProfiles, membershipId]
    )

    return primaryProfile ? (
        <ResolvedPlayer
            primaryProfile={primaryProfile}
            isFireteamIncluded={isFireteamIncluded}
            addMore={add}>
            <button className={styles["remove-btn"]} onClick={remove}>
                X
            </button>
        </ResolvedPlayer>
    ) : (
        <Loading className={styles["player"]} />
    )
}

const queryOptions = {
    refetchOnWindowFocus: true,
    staleTime: 20000
}
function ResolvedPlayer({
    primaryProfile,
    isFireteamIncluded,
    addMore,
    children
}: {
    primaryProfile: DestinyProfileUserInfoCard
    isFireteamIncluded: boolean
    addMore: (membershipId: string, isFireteamIncluded: boolean) => void
    children: ReactNode
}) {
    const bungie = useBungieClient()
    const {
        data: profileData,
        isLoading: isLoadingProfile,
        isRefetching: isRefetchingProfile
    } = useProfile(
        {
            membershipType: primaryProfile.membershipType,
            destinyMembershipId: primaryProfile.membershipId
        },
        queryOptions
    )
    const {
        data: transitoryComponent,
        isLoading: isLoadingTransitoryComponent,
        isRefetching: isRefetchingTransitoryComponent
    } = useProfileTransitory(
        {
            membershipType: primaryProfile.membershipType,
            destinyMembershipId: primaryProfile.membershipId
        },
        {
            ...queryOptions,
            onSuccess(data) {
                if (isFireteamIncluded) {
                    data.profileTransitoryData.data?.partyMembers.map(pm =>
                        addMore(pm.membershipId, false)
                    )
                }
            }
        }
    )

    const mostRecentCharacterId = useMemo(
        () =>
            profileData?.characters.data
                ? Object.values(profileData.characters.data).reduce((base, current) =>
                      new Date(current.dateLastPlayed).getTime() >
                      new Date(base.dateLastPlayed).getTime()
                          ? current
                          : base
                  ).characterId
                : null,
        [profileData]
    )

    const items = mostRecentCharacterId
        ? profileData?.characterEquipment?.data?.[mostRecentCharacterId].items
        : undefined
    const sockets = profileData?.itemComponents?.sockets?.data

    const subclass = items?.find(i => i.bucketHash === subclassBucket)

    const kinetic = findWeaponInBucket(items ?? [], "kinetic")
    const energy = findWeaponInBucket(items ?? [], "energy")
    const power = findWeaponInBucket(items ?? [], "power")

    const helmet = findArmorInBucket(items ?? [], "helmet")
    const arms = findArmorInBucket(items ?? [], "arms")
    const chest = findArmorInBucket(items ?? [], "chest")
    const legs = findArmorInBucket(items ?? [], "legs")
    const classItem = findArmorInBucket(items ?? [], "classItem")

    if (isLoadingProfile || isLoadingTransitoryComponent)
        return <Loading className={styles["player"]} />
    return profileData ? (
        <div className={styles["player"]}>
            {profileData.profile?.data && profileData.characters?.data && (
                <PlayerHeader
                    profile={profileData.profile.data}
                    characters={profileData.characters.data}
                />
            )}
            {children}
            {(isRefetchingProfile || isRefetchingTransitoryComponent) && (
                <div className={styles["loader-container"]}>
                    <Loader $stroke={3} />
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
