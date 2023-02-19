import { getPostGameCarnageReport } from 'oodestiny/endpoints/Destiny2'
import { DestinyPostGameCarnageReportData } from 'oodestiny/schemas'

export class DestinyClient {
    public readonly access_token: string | null;
    constructor(access_token?: string) {
        this.access_token = access_token ?? null;
    }

    async getPGCR(activityId: string): Promise<DestinyPostGameCarnageReportData> {
        const res = await getPostGameCarnageReport({ activityId })
        return res.Response;
    }
}