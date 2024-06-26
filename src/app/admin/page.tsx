import { type Metadata } from "next"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { AddVanityForm } from "./AddVanityForm"
import { RemoveVanityForm } from "./DeleteVanityForm"

export default async function Page() {
    return (
        <PageWrapper>
            <h1>Admin Panel</h1>
            <Flex $direction="column" $crossAxis="flex-start">
                <AddVanityForm />
                <RemoveVanityForm />
            </Flex>
        </PageWrapper>
    )
}

export const metadata: Metadata = {
    title: "Admin Dashboard"
}
