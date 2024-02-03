import { Hydrate } from "@tanstack/react-query"
import { InferGetStaticPropsType } from "next"
import { IndividualLeaderboadGlobal } from "~/components/leaderboards/IndividualLeaderboardGlobal"
import { createGlobalGetStaticProps } from "~/server/leaderboardHelpers"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"

const getStaticProps = createGlobalGetStaticProps(Leaderboard.Clears)

export { getStaticProps }

export default function AllClears({
    dehydratedState
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Hydrate state={dehydratedState}>
            <IndividualLeaderboadGlobal board={Leaderboard.Clears} />
        </Hydrate>
    )
}
