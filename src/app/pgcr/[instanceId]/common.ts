import { getRaidHubApi } from "~/services/raidhub/common"

export type PageProps = {
    params: {
        instanceId: string
    }
}
export const prefetchActivity = async (instanceId: string) =>
    getRaidHubApi("/activity/{instanceId}", { instanceId }, null).catch(() => null)
