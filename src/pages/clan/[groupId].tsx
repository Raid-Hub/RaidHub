import { createContext, useContext } from "react"
import { GetStaticProps, NextPage } from "next"
import { z } from "zod"
import { GroupMember, GroupResponse } from "bungie-net-core/models"
import ClanComponent from "~/components/clan/Clan"
import { useBungieClient } from "~/components/app/TokenManager"

const ClanContext = createContext<{
    clan: (GroupResponse & { groupMembers: readonly GroupMember[] }) | null | undefined
    isLoading: boolean
}>({
    clan: null,
    isLoading: false
})

export const useClanContext = () => useContext(ClanContext)

type ClanPageProps = {
    groupId: string
}
const PGCRPage: NextPage<ClanPageProps> = ({ groupId }) => {
    const bungie = useBungieClient()
    const { data: clan, isLoading } = bungie.clan.byId.useQuery(
        { groupId },
        { staleTime: 10 * 60000 /*clan does not update very often*/ }
    )

    return (
        <ClanContext.Provider value={{ clan, isLoading }}>
            <ClanComponent />
        </ClanContext.Provider>
    )
}

export default PGCRPage

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps<ClanPageProps> = async ({ params }) => {
    try {
        const props = z
            .object({
                groupId: z.string().regex(/^\d+$/)
            })
            .parse(params)
        return {
            props
        }
    } catch {
        return { notFound: true }
    }
}
