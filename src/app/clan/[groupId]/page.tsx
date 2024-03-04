import { getGroup } from "bungie-net-core/endpoints/GroupV2"
import { ClanComponent } from "components_old/clan/Clan"
import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { metadata as rootMetaData } from "~/app/layout"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { type BungieAPIError } from "~/models/BungieAPIError"
import ServerBungieClient from "~/server/serverBungieClient"
import { fixClanName } from "~/util/destiny/fixClanName"

type PageProps = {
    params: {
        groupId: string
    }
}

const bungieClient = new ServerBungieClient({
    revalidate: 3600 // 1 hour
})

export default async function Page({ params }: PageProps) {
    const clan = await getGroup(bungieClient, params)
        .then(res => res.Response)
        .catch(() => null)

    return (
        <PageWrapper>
            <ClanComponent clan={clan} groupId={params.groupId} />
        </PageWrapper>
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const clan = await getGroup(bungieClient, params)
        .then(res => res.Response)
        .catch((e: BungieAPIError) => {
            if (e.ErrorCode === 622) {
                notFound()
            } else {
                throw e
            }
        })

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
