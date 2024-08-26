import { getClanBannerSource } from "bungie-net-core/endpoints/Destiny2"
import { getGroup } from "bungie-net-core/endpoints/GroupV2"
import { type ClanBannerSource } from "bungie-net-core/models"
import { notFound } from "next/navigation"
import { BungieAPIError } from "~/models/BungieAPIError"
import ServerBungieClient from "~/server/serverBungieClient"
import { reactRequestDedupe } from "~/util/react-cache"

export type PageProps = {
    params: {
        groupId: string
    }
}

const clanClient = new ServerBungieClient({
    next: { revalidate: 3600 }, // 1 hour
    timeout: 6000
})

export const getClan = reactRequestDedupe(async (groupId: string) =>
    getGroup(clanClient, { groupId })
        .then(res => {
            if (res.Response.detail.groupType != 1) {
                notFound()
            }
            return res.Response
        })
        .catch(err => {
            if (err instanceof BungieAPIError && err.ErrorCode === 686) {
                notFound()
            } else {
                return null
            }
        })
)

const bannerClient = new ServerBungieClient({
    next: { revalidate: false }, // 1 hour
    timeout: 4000
})

export const getClanBannerDefinitions = reactRequestDedupe(() =>
    getClanBannerSource(bannerClient).then(res => res.Response)
)
