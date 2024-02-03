import { GetStaticProps, NextPage } from "next"
import { z } from "zod"
import ClanComponent from "~/components/clan/Clan"

export type ClanPageProps = {
    groupId: string
}

const PGCRPage: NextPage<ClanPageProps> = ({ groupId }) => {
    return <ClanComponent groupId={groupId} />
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
