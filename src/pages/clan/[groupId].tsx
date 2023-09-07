import { Clan } from "~/types/profile"
import { createContext, useContext } from "react"
import { GetStaticProps, NextPage } from "next"
import { useGroup } from "~/hooks/bungie/useGroup"
import { z } from "zod"
import { GroupMember, GroupResponse } from "bungie-net-core/models"
import ClanComponent from "~/components/clan/Clan"

const ClanContext = createContext<{
    clan:
        | (GroupResponse & { groupMembers: readonly GroupMember[]; detail: Clan })
        | null
        | undefined
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
    const { data: clan, isLoading } = useGroup({ groupId })

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
