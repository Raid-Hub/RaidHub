import { PGCRContentPanel } from "~/components/__deprecated__/pgcr/ContentPanel"
import SummaryStatsGrid from "~/components/__deprecated__/pgcr/SummaryStatsGrid"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { PGCRStateManager } from "./PGCRStateManager"
import type { PGCRPageProps } from "./types"

export const PGCRPage = (props: PGCRPageProps) => {
    return (
        <PGCRStateManager {...props}>
            <PageWrapper pageProps={props} $maxWidth={1200}>
                <PGCRContentPanel />
                <SummaryStatsGrid />
            </PageWrapper>
        </PGCRStateManager>
    )
}
