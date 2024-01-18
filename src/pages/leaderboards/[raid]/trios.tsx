import { Hydrate } from "@tanstack/react-query"
import { InferGetStaticPropsType } from "next"
import { IndividualLeaderboad } from "~/components/leaderboards/IndividualLeaderboard"
import { createGetStaticPaths, createGetStaticProps } from "~/server/leaderboardHelpers"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { Raid } from "~/types/raids"

const getStaticPaths = createGetStaticPaths([
    Raid.LEVIATHAN,
    Raid.EATER_OF_WORLDS,
    Raid.LAST_WISH,
    Raid.SCOURGE_OF_THE_PAST,
    Raid.CROWN_OF_SORROW,
    Raid.GARDEN_OF_SALVATION,
    Raid.DEEP_STONE_CRYPT,
    Raid.VOW_OF_THE_DISCIPLE,
    Raid.VAULT_OF_GLASS,
    Raid.KINGS_FALL,
    Raid.ROOT_OF_NIGHTMARES,
    Raid.CROTAS_END
])
const getStaticProps = createGetStaticProps(Leaderboard.Trios)

export { getStaticPaths, getStaticProps }

export default function RaidTrios({
    dehydratedState,
    ...props
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Hydrate state={dehydratedState}>
            <IndividualLeaderboad {...props} />
        </Hydrate>
    )
}
