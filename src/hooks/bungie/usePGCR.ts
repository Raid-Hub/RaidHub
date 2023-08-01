import { DestinyCharacterComponent, UserInfoCard } from "bungie-net-core/lib/models"
import { useCallback, useEffect, useState } from "react"
import { ErrorHandler, Loading } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getPGCR } from "../../services/bungie/getPGCR"
import DestinyPGCR from "../../models/pgcr/PGCR"
import { Collection } from "@discordjs/collection"
import { getLinkedDestinyProfile } from "../../services/bungie/getLinkedDestinyProfile"
import { getDestinyCharacter } from "../../services/bungie/getDestinyCharacter"

type UsePGCRParams = {
    activityId: string
    errorHandler: ErrorHandler
}
type UsePGCR = {
    pgcr: DestinyPGCR | null
    loadingState: Loading
}

export function usePGCR({ activityId, errorHandler }: UsePGCRParams): UsePGCR {
    const [pgcr, setPGCR] = useState<DestinyPGCR | null>(null)
    const [loadingState, setLoading] = useState<Loading>(Loading.LOADING)
    const [error, setError] = useState<Error | null>(null)
    const client = useBungieClient()

    const fetchData = useCallback(async () => {
        try {
            setPGCR(null)
            const pgcr = await getPGCR({ activityId, client })
            setPGCR(pgcr)
            setLoading(Loading.HYDRATING)

            const hydrationData = new Collection<
                string,
                [UserInfoCard, DestinyCharacterComponent | null]
            >()
            if (pgcr.entries.length < 50) {
                await Promise.all(
                    pgcr.entries.map(async entry => {
                        let destinyUserInfo = entry.player.destinyUserInfo
                        if (!entry.player.destinyUserInfo.membershipType) {
                            destinyUserInfo = await getLinkedDestinyProfile({
                                membershipId: entry.player.destinyUserInfo.membershipId,
                                client
                            })
                        }

                        const character = await getDestinyCharacter({
                            destinyMembershipId: destinyUserInfo.membershipId,
                            membershipType: destinyUserInfo.membershipType,
                            characterId: entry.characterId,
                            client
                        }).catch(deleted => null)

                        hydrationData.set(entry.characterId, [destinyUserInfo, character])
                    })
                )
            }
            pgcr.hydrate(hydrationData)
        } catch (e: any) {
            setError(e)
        } finally {
            setLoading(Loading.FALSE)
        }
    }, [client, activityId])

    useEffect(() => {
        error && CustomError.handle(errorHandler, error, ErrorCode.PGCR)
    }, [error, errorHandler])

    useEffect(() => {
        setLoading(Loading.LOADING)

        fetchData()
    }, [activityId, errorHandler, fetchData])

    return { pgcr, loadingState }
}
