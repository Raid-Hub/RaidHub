import { RaidHubAPIResponse, RaidHubManifest } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "."

export const manifestQueryKey = ["raidhub_manifest"] as const

export async function getManifest() {
    const url = new URL(getRaidHubBaseUrl() + `/manifest`)

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<RaidHubManifest>

    if (data.success) {
        return data.response
    } else {
        const err = new Error(data.message)
        Object.assign(err, data.error)
        throw err
    }
}
