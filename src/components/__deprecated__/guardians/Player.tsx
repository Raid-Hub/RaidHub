import { useMemo, type ReactNode } from "react"
import { BackgroundImage } from "~/components/BackgroundImage"
import { Loader } from "~/components/Loader"
import { Loading } from "~/components/Loading"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { emblemBucket, subclassBucket } from "~/data/inventory-item-buckets"
import { useItemDefinition } from "~/hooks/dexie"
import { useProfileLiveData, useProfileTransitory } from "~/services/bungie/hooks"
import { useRaidHubResolvePlayer } from "~/services/raidhub/hooks"
import { type RaidHubPlayerInfo } from "~/services/raidhub/types"
import { bungieEmblemUrl, getBungieDisplayName } from "~/util/destiny"
import { findArmorInBucket, findWeaponInBucket } from "~/util/destiny/itemUtils"
import PlayerItem from "./PlayerItem"
import styles from "./guardians.module.css"

/** @deprecated */
export default function Player({
    membershipId,
    remove
}: {
    membershipId: string
    remove: () => void
}) {
    const { data: resolvedPlayer } = useRaidHubResolvePlayer(membershipId)

    return resolvedPlayer ? (
        <ResolvedPlayer {...resolvedPlayer}>
            <button className={styles["remove-btn"]} onClick={remove}>
                X
            </button>
        </ResolvedPlayer>
    ) : (
        <Loading className={styles.player} />
    )
}

const queryOptions = {
    refetchOnWindowFocus: true,
    staleTime: 20000
}

function ResolvedPlayer({
    children,
    ...profile
}: RaidHubPlayerInfo & {
    children: ReactNode
}) {
    const {
        data: profileData,
        isLoading: isLoadingProfile,
        isRefetching: isRefetchingProfile
    } = useProfileLiveData(
        {
            membershipType: profile.membershipType,
            destinyMembershipId: profile.membershipId
        },
        queryOptions
    )

    const {
        isLoading: isLoadingTransitoryComponent,
        isRefetching: isRefetchingTransitoryComponent
    } = useProfileTransitory(
        {
            membershipType: profile.membershipType,
            destinyMembershipId: profile.membershipId
        },
        {
            ...queryOptions
        }
    )

    const mostRecentCharacterId = useMemo(
        () =>
            profileData?.characterActivities?.data
                ? Object.entries(profileData.characterActivities.data).reduce<
                      [string | null, number]
                  >(
                      (base, [id, component]) => {
                          const dateStarted = new Date(component.dateActivityStarted).getTime()
                          return dateStarted > base[1] ? [id, dateStarted] : base
                      },
                      [null, 0]
                  )[0]
                : null,
        [profileData]
    )

    const items = mostRecentCharacterId
        ? profileData?.characterEquipment?.data?.[mostRecentCharacterId].items
        : undefined

    const emblem = useItemDefinition(items?.find(i => i.bucketHash === emblemBucket)?.itemHash ?? 0)
    const sockets = profileData?.itemComponents?.sockets?.data

    const { subclass, kinetic, energy, power, helmet, arms, chest, legs, classItem } = useMemo(
        () => ({
            subclass: items?.find(i => i.bucketHash === subclassBucket),

            kinetic: findWeaponInBucket(items ?? [], "kinetic"),
            energy: findWeaponInBucket(items ?? [], "energy"),
            power: findWeaponInBucket(items ?? [], "power"),

            helmet: findArmorInBucket(items ?? [], "helmet"),
            arms: findArmorInBucket(items ?? [], "arms"),
            chest: findArmorInBucket(items ?? [], "chest"),
            legs: findArmorInBucket(items ?? [], "legs"),
            classItem: findArmorInBucket(items ?? [], "classItem")
        }),
        [items]
    )

    if (isLoadingProfile || isLoadingTransitoryComponent) {
        return (
            <Loading className={styles.player} $alpha={0.8} $minWidth="100%" $borderRadius="10px" />
        )
    }

    return profileData ? (
        <div className={styles.player}>
            {children}
            {(isRefetchingProfile || isRefetchingTransitoryComponent) && (
                <div className={styles["loader-container"]}>
                    <Loader $stroke={3} />
                </div>
            )}
            <Container
                $aspectRatio={{
                    width: 474,
                    height: 96
                }}>
                <Flex style={{ fontSize: "1.25rem" }}>{getBungieDisplayName(profile)}</Flex>
                <BackgroundImage
                    opacity={1}
                    src={bungieEmblemUrl(emblem)}
                    alt={emblem?.displayProperties.name ?? ""}
                />
            </Container>
            {sockets && (
                <div className={styles.items}>
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
