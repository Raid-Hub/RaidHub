import { Suspense } from "react"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { CheckpointLogo } from "./CheckpointLogo"
import { Checkpoints } from "./Checkpoints"

export const revalidate = false

export default function Page() {
    return (
        <PageWrapper>
            <CheckpointLogo />
            <Suspense fallback={<div>Loading...</div>}>
                <Checkpoints />
            </Suspense>
        </PageWrapper>
    )
}
