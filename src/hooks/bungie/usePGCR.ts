import { DestinyCharacterComponent, DestinyProfileComponent } from "bungie-net-core/lib/models"
import { useCallback, useEffect, useState } from "react"
import { ErrorHandler, Loading } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getPGCR } from "../../services/bungie/getPGCR"
import { findProfileWithoutPlatform } from "../../services/bungie/findProfileWithoutPlatform"
import DestinyPGCR from "../../models/pgcr/PGCR"

type UsePGCRParams = {
    activityId: string | null | undefined
    errorHandler: ErrorHandler
}
type UsePGCR = {
    pgcr: DestinyPGCR | null
    loadingState: Loading
}

export function usePGCR({ activityId, errorHandler }: UsePGCRParams): UsePGCR {
    const [pgcr, setPGCR] = useState<DestinyPGCR | null>(null)
    const [loadingState, setLoading] = useState<Loading>(Loading.LOADING)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (activityId: string) => {
            try {
                setPGCR(null)
                const pgcr = await getPGCR({ activityId, client })
                setPGCR(pgcr)
                setLoading(Loading.HYDRATING)

                const dataForMissingProfiles = new Map<
                    string,
                    [DestinyProfileComponent, DestinyCharacterComponent]
                >()
                await Promise.all(
                    pgcr.entries.map(async entry => {
                        if (!entry.player.bungieNetUserInfo.membershipType) {
                            const res = await findProfileWithoutPlatform({
                                destinyMembershipId: entry.player.bungieNetUserInfo.membershipId,
                                client
                            })
                            if (res.profile.data && res.characters.data?.[entry.characterId]) {
                                dataForMissingProfiles.set(
                                    entry.player.bungieNetUserInfo.membershipId,
                                    [res.profile.data, res.characters.data[entry.characterId]]
                                )
                            }
                        }
                    })
                )
                pgcr.hydrate(dataForMissingProfiles)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.PGCRError)
            } finally {
                setLoading(Loading.FALSE)
            }
        },
        [client, errorHandler]
    )

    useEffect(() => {
        setLoading(Loading.LOADING)

        if (activityId) {
            fetchData(activityId)
        } else if (activityId === null) {
            setLoading(Loading.FALSE)
        }
    }, [activityId, errorHandler, fetchData])

    return { pgcr, loadingState }
}
