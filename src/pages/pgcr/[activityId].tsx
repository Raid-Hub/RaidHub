import { z } from "zod"
import PGCR from "~/components/pgcr/PGCR"
import Custom404 from "../404"
import { getActivity } from "~/services/raidhub/getActivitiy"
import { RaidHubActivityResponse } from "~/types/raidhub-api"
import { isBot } from "~/util/userAgent"
import { CrawlableNextPage } from "~/types/generic"
import Head from "next/head"
import { LocalizedStrings } from "~/util/presentation/localized-strings"
import { raidTupleFromHash } from "~/util/destiny/raidUtils"
import { Tag } from "~/util/raidhub/tags"

const PGCRPage: CrawlableNextPage<
    {
        activityId: unknown
    },
    { activity?: RaidHubActivityResponse }
> = props => {
    const parsedQuery = z.string().regex(/^\d+$/).optional().safeParse(props.activityId)

    return !parsedQuery.success ? (
        <Custom404 error={parsedQuery.error.message} />
    ) : parsedQuery.data ? (
        <PGCR activityId={parsedQuery.data} />
    ) : null
}

PGCRPage.getInitialProps = async ({ req, query }) => {
    const userAgent = req?.headers["user-agent"]
    const _isBot = isBot(userAgent)

    if (_isBot) {
        const activity = await getActivity(String(query.activityId)).catch(e => undefined)

        return { activity, isBot: _isBot }
    } else {
        return { activityId: query.activityId, isBot: _isBot ?? false }
    }
}

PGCRPage.Head = ({ activity, children }) => {
    if (!activity) return null

    const strs = LocalizedStrings.en

    const [raid, difficulty] = raidTupleFromHash(activity.raidHash)
    const raidName = strs.raidNames[raid]
    const difficultyName = strs.difficulty[difficulty]

    const title = [
        activity.playerCount < 4 ? strs.tags[activity.playerCount as Tag] : null,
        activity.flawless ? "Flawless" : null,
        raidName,
        `(${difficultyName})`
    ]
        .filter(Boolean)
        .join(" ")
    const description = `Trio Flawless Deep Stone Crypt`
    const url = `https://raidhub.app/pgcr/${activity.instanceId}`
    const thumbnail = "https://b.vlsp.network/Generate/Screenshot/Report?instanceId=14052506544"
    return (
        <Head>
            <title>{title}</title>

            {children}

            {/* Basic */}
            <meta property="og:title" content={title} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={thumbnail} />
            <meta property="og:description" content={description} />

            {/* Discord */}
            {/* <meta property="discord:owner" content="Your Discord user ID" /> */}
            <meta property="discord:site" content="https://discord.gg/raidhub" />
            <meta name="theme-color" content="#f0802ffa" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@raidhubap" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={thumbnail} />
            <meta name="twitter:image:alt" content={`Thumbnail for Destiny 2 Raid: ${title}`} />
        </Head>
    )
}
PGCRPage.Head.displayName = "PGCRPage.Head"

export default PGCRPage
