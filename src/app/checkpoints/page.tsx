import Link from "next/link"
import { Suspense } from "react"
import { Card } from "~/components/Card"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { Checkpoints } from "./Checkpoints"

export const revalidate = 10

export default function Page() {
    return (
        <PageWrapper>
            <Flex $direction="column" $padding={0} $crossAxis="flex-start">
                <h1>Checkpoints</h1>
                <Card style={{ padding: "1em" }}>
                    All checkpoints are provided by{" "}
                    <Link href="https://d2checkpoint.com/" target="_blank">
                        d2checkpoint.com
                    </Link>
                    . Visit their site for more information and FAQs.
                </Card>
                <Suspense fallback={<div>Loading...</div>}>
                    <Checkpoints />
                </Suspense>
            </Flex>
        </PageWrapper>
    )
}
