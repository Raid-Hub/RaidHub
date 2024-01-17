import { Hydrate } from "@tanstack/react-query"
import { InferGetStaticPropsType } from "next"
import { IndividualLeaderboad } from "~/components/leaderboards/IndividualLeaderboard"
import { createGetStaticPaths, createGetStaticProps } from "~/server/leaderboardHelpers"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { Raid } from "~/types/raids"

const getStaticPaths = createGetStaticPaths([
    Raid.EATER_OF_WORLDS,
    Raid.LAST_WISH,
    Raid.GARDEN_OF_SALVATION,
    Raid.VAULT_OF_GLASS,
    Raid.ROOT_OF_NIGHTMARES
])
const getStaticProps = createGetStaticProps(Leaderboard.Solos)

export { getStaticPaths, getStaticProps }

export default function RaidSolos({
    dehydratedState,
    ...props
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Hydrate state={dehydratedState}>
            <IndividualLeaderboad {...props} />
        </Hydrate>
    )
}
