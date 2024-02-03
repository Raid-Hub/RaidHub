import { Hydrate } from "@tanstack/react-query"
import { InferGetStaticPropsType } from "next"
import { IndividualLeaderboad } from "~/components/leaderboards/IndividualLeaderboard"
import { createGetStaticPaths, createGetStaticProps } from "~/server/leaderboardHelpers"
import { Leaderboard } from "~/services/raidhub/getLeaderboard"
import { ListedRaids } from "~/types/raidhub-api"

const getStaticPaths = createGetStaticPaths(ListedRaids)
const getStaticProps = createGetStaticProps(Leaderboard.Sherpa)

export { getStaticPaths, getStaticProps }

export default function RaidSherpas({
    dehydratedState,
    ...props
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Hydrate state={dehydratedState}>
            <IndividualLeaderboad {...props} />
        </Hydrate>
    )
}
