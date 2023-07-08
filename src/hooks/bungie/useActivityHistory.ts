import { Collection } from "@discordjs/collection"
import { DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import { useCallback, useEffect, useState } from "react"
import { Raid } from "../../util/destiny/raid"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { ErrorHandler } from "../../types/generic"
import { ActivityCollectionDictionary, MembershipWithCharacters } from "../../types/profile"
import { getAllCharacterRaids } from "../../services/bungie/getAllCharacterRaids"

type UseActivityHistory = (params: {
    characterMemberships: MembershipWithCharacters[] | null
    errorHandler: ErrorHandler
}) => {
    activitiesByRaid: ActivityCollectionDictionary | null
    allActivities: DestinyHistoricalStatsPeriodGroup[] | null
    isLoading: boolean
}

export const useActivityHistory: UseActivityHistory = ({ characterMemberships, errorHandler }) => {
    const [activitiesByRaid, setActivitiesByRaid] = useState<ActivityCollectionDictionary | null>(
        null
    )
    const [allActivities, setAllActivities] = useState<DestinyHistoricalStatsPeriodGroup[] | null>(
        null
    )
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (profiles: MembershipWithCharacters[]) => {
            setActivitiesByRaid(null)
            const dict: ActivityCollectionDictionary = {
                [Raid.LEVIATHAN]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
                [Raid.EATER_OF_WORLDS]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
                [Raid.SPIRE_OF_STARS]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
                [Raid.LAST_WISH]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
                [Raid.SCOURGE_OF_THE_PAST]: new Collection<
                    string,
                    DestinyHistoricalStatsPeriodGroup
                >(),
                [Raid.CROWN_OF_SORROW]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
                [Raid.GARDEN_OF_SALVATION]: new Collection<
                    string,
                    DestinyHistoricalStatsPeriodGroup
                >(),
                [Raid.DEEP_STONE_CRYPT]: new Collection<
                    string,
                    DestinyHistoricalStatsPeriodGroup
                >(),
                [Raid.VAULT_OF_GLASS]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
                [Raid.VOW_OF_THE_DISCIPLE]: new Collection<
                    string,
                    DestinyHistoricalStatsPeriodGroup
                >(),
                [Raid.KINGS_FALL]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
                [Raid.ROOT_OF_NIGHTMARES]: new Collection<
                    string,
                    DestinyHistoricalStatsPeriodGroup
                >(),
                [Raid.NA]: new Collection<string, DestinyHistoricalStatsPeriodGroup>()
            }
            try {
                const activities = (
                    await Promise.all(
                        profiles.map(({ destinyMembershipId, membershipType, characterIds }) =>
                            Promise.all(
                                characterIds.map(characterId =>
                                    getAllCharacterRaids({
                                        characterId,
                                        destinyMembershipId,
                                        membershipType,
                                        client,
                                        dict
                                    })
                                )
                            )
                        )
                    )
                )
                    .flat(2)
                    .sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime())
                setAllActivities(activities)

                Object.values(dict).forEach(collection =>
                    collection.sort(
                        (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()
                    )
                )
                setActivitiesByRaid(dict)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.ActivityHistory)
            } finally {
                setLoading(false)
            }
        },
        [client, errorHandler]
    )

    useEffect(() => {
        if (characterMemberships) {
            setLoading(true)
            fetchData(characterMemberships)
        } else {
            setLoading(false)
        }
    }, [characterMemberships, fetchData])
    return { activitiesByRaid, allActivities, isLoading }
}
