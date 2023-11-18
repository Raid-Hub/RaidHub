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
    { activity: RaidHubActivityResponse }
> = props => {
    const parsedQuery = z.string().regex(/^\d+$/).optional().safeParse(props.activityId)

    return !parsedQuery.success ? (
        <Custom404 error={parsedQuery.error.message} />
    ) : parsedQuery.data ? (
        <PGCR activityId={parsedQuery.data} />
    ) : null
}

PGCRPage.getInitialProps = async ({ req, res, query }) => {
    if (res && req && "user-agent" in req.headers && isBot(req.headers["user-agent"]!)) {
        try {
            const activity = await getActivity(String(query.activityId))
            res.setHeader("Cache-Control", "max-age=31536000")
            return { activity, headOnly: true }
        } catch {
            return {
                activityId: query.activityId
            }
        }
    } else {
        return {
            activityId: query.activityId
        }
    }
}

PGCRPage.Head = ({ activity, children }) => {
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

    const dateCompleted = new Date(activity.dateCompleted)

    const description = `${
        activity.completed
            ? activity.fresh == false
                ? "Checkpoint cleared on"
                : "Completed on"
            : "Attempted on"
    } ${dateCompleted.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",

        timeZone: "America/Los_Angeles",
        timeZoneName: "short"
    })}`

    const url = `https://raidhub.app/pgcr/${activity.instanceId}`
    return (
        <Head>
            {children}

            <meta httpEquiv="date" content={dateCompleted.toDateString()} />
            <meta property="article:published_time" content={dateCompleted.toISOString()} />

            {/* Basic */}
            <meta property="og:title" content={title} />
            <meta property="og:url" content={url} />
            {/* <meta property="og:image" content={thumbnail} /> */}
            <meta property="og:description" content={description} />

            {/* Twitter */}
            {/* <meta name="twitter:card" content="summary_large_image" /> */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content="/logo.png" />
            {/* <meta name="twitter:image:alt" content={`Thumbnail for Destiny 2 Raid: ${title}`} /> */}

            <title>{title}</title>
        </Head>
    )
}
PGCRPage.Head.displayName = "PGCRPage.Head"

export default PGCRPage
