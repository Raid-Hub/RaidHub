import { NextPage } from "next"
import Head from "next/head"
import { z } from "zod"
import { useLocale } from "~/app/managers/LocaleManager"
import PGCR from "~/components/pgcr/PGCR"
import { useRaidHubActivity } from "~/hooks/raidhub/useRaidHubActivity"
import { getActivity } from "~/services/raidhub/getActivitiy"
import { RaidHubActivityResponse } from "~/types/raidhub-api"
import { raidTupleFromHash } from "~/util/destiny/raidUtils"
import { Tag } from "~/util/tags"
import { isBot } from "~/util/userAgent"
import Custom404 from "../404"

const PGCRPage: NextPage<
    | { notFound: true }
    | { activityId: string }
    | { activityId: string; serverRendered: true; activity: RaidHubActivityResponse }
> = props => {
    if ("notFound" in props) {
        return <Custom404 error="Invalid instance ID" />
    }
    return (
        <>
            <PGCRMetaData
                activityId={props.activityId}
                activity={"serverRendered" in props ? props.activity : undefined}
            />
            <PGCR activityId={props.activityId} />
        </>
    )
}

PGCRPage.getInitialProps = async ({ req, res, query }) => {
    const parsedQuery = z.string().regex(/^\d+$/).safeParse(query.activityId)
    if (!parsedQuery.success) {
        return {
            notFound: true
        }
    }

    const activityId = parsedQuery.data

    if (res && req && "user-agent" in req.headers) {
        res.setHeader("X-Server-Render-Agent", req.headers["user-agent"]!)
        if (isBot(req.headers["user-agent"]!)) {
            res.setHeader("X-Should-Server-Render", "true")
            try {
                const activity = await getActivity(activityId)
                return { activityId: activityId, serverRendered: true, activity }
            } catch (e: any) {
                if (!e.notFound) {
                    console.error(e)
                }
            }
        } else {
            res.setHeader("X-Should-Server-Render", "false")
        }
    }
    return {
        activityId: activityId
    }
}

function PGCRMetaData({
    activityId,
    activity
}: {
    activityId: string
    activity?: RaidHubActivityResponse
}) {
    const { data } = useRaidHubActivity(activityId, activity)
    const { strings } = useLocale()

    if (!data) return null

    const [raid, difficulty] = raidTupleFromHash(data.raidHash)
    const raidName = strings.raidNames[raid]
    const difficultyName = strings.difficulty[difficulty]

    const title = [
        data.playerCount < 4 ? strings.tags[data.playerCount as Tag] : null,
        data.flawless ? "Flawless" : null,
        raidName,
        `(${difficultyName})`,
        "| RaidHub"
    ]
        .filter(Boolean)
        .join(" ")

    const dateCompleted = new Date(data.dateCompleted)

    const description = `${
        data.completed
            ? data.fresh == false
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

    return (
        <Head>
            {/* key prevents duplicates */}
            <title key={title}>{title}</title>
            <meta key="description" name="description" content={description} />

            <meta key="og:title" property="og:title" content={title} />
            <meta key="og:description" property="og:description" content={description} />
            {/* <meta key="og:url" property="og:url" content={url} /> */}

            {/* Twitter */}
            <meta key="twitter:title" name="twitter:title" content={title} />
            <meta key="twitter:description" name="twitter:description" content={description} />
            {/* <meta key="twitter:card" name="twitter:card" content="summary_large_image" /> */}
            {/* <meta key="twitter:image:alt" name="twitter:image:alt" content={`Thumbnail for Destiny 2 Raid: ${title}`} /> */}

            <meta
                key="article:published_time"
                property="article:published_time"
                content={dateCompleted.toISOString()}
            />
            <meta httpEquiv="date" content={dateCompleted.toDateString()} />
            <meta name="date" content={dateCompleted.toISOString().slice(0, 10)} />
        </Head>
    )
}

export default PGCRPage
