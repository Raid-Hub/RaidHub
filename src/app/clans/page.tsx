import { PageWrapper } from "~/components/layout/PageWrapper"
import { metadata as rootMetadata } from "../layout"
import { ClanLeaderboards } from "./ClanLeaderboards"

export const metadata = {
    title: "Clan Leaderboards",
    description: "View the top clans in Destiny 2 by a variety of metrics.",
    keywords: [...rootMetadata.keywords, "clan", "rankings"]
}

export default function Page() {
    return (
        <PageWrapper>
            <h1>Clan Leaderboards</h1>
            <p>
                Clan leaderboards refresh once per week prior to reset on Monday. Clans with atleast
                one player in the top 1000 of an individual leaderboard are included in the clan
                leaderboard.
            </p>
            <ClanLeaderboards />
        </PageWrapper>
    )
}
