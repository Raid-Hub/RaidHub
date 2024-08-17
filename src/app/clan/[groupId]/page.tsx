import { getGroup } from "bungie-net-core/endpoints/GroupV2"
import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { metadata as rootMetaData } from "~/app/layout"
import { ClanComponent } from "~/components/__deprecated__/clan/Clan"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { BungieAPIError } from "~/models/BungieAPIError"
import ServerBungieClient from "~/server/serverBungieClient"
import { fixClanName } from "~/util/destiny/fixClanName"
import { reactRequestDedupe } from "~/util/react-cache"

type PageProps = {
    params: {
        groupId: string
    }
}

export default async function Page({ params }: PageProps) {
    const clan = await getClan(params.groupId)

    return (
        <PageWrapper>
            <ClanComponent clan={clan} groupId={params.groupId} />
        </PageWrapper>
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const clan = await getClan(params.groupId)

    if (!clan) return {}

    const clanName = fixClanName(clan.detail.name)
    return {
        title: clanName,
        description: clan.detail.motto,
        openGraph: {
            ...rootMetaData.openGraph,
            title: clanName,
            description: clan.detail.motto
        }
    }
}

const bungieClient = new ServerBungieClient({
    next: { revalidate: 3600 }, // 1 hour
    timeout: 2500
})

const notFoundErrCodes = [
    686, // ClanNotFound
    622 // GroupNotFound
]

const getClan = reactRequestDedupe(async (groupId: string) =>
    getGroup(bungieClient, { groupId })
        .then(res => res.Response)
        .catch(e => {
            if (e instanceof BungieAPIError && notFoundErrCodes.includes(e.ErrorCode)) {
                notFound()
            } else {
                return null
            }
        })
)
