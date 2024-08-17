import { Tag } from "~/models/tag"
import { getRaidHubApi } from "~/services/raidhub/common"
import { type RaidHubInstanceExtended } from "~/services/raidhub/types"
import { reactRequestDedupe } from "~/util/react-cache"

export type PageProps = {
    params: {
        instanceId: string
    }
}
export const prefetchActivity = reactRequestDedupe((instanceId: string) =>
    getRaidHubApi("/activity/{instanceId}", { instanceId }, null)
        .then(res => res.response)
        .catch(() => null)
)

export const getMetaData = (activity: RaidHubInstanceExtended) => {
    const title = [
        activity.completed
            ? activity.playerCount === 1
                ? Tag.SOLO
                : activity.playerCount === 2
                ? Tag.DUO
                : activity.playerCount === 3
                ? Tag.TRIO
                : null
            : null,
        activity.flawless ? "Flawless" : null,
        activity.metadata.activityName,
        `(${activity.metadata.versionName})`
    ]
        .filter(Boolean)
        .join(" ")

    const dateCompleted = new Date(activity.dateCompleted)

    const dateString = dateCompleted.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",

        timeZone: "America/Los_Angeles",
        timeZoneName: "short"
    })

    const description = `${title} ${
        activity.completed
            ? activity.fresh == false
                ? "checkpoint cleared on"
                : "completed on"
            : "attempted on"
    } ${dateString}`

    return { title, description, dateString }
}
