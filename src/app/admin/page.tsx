import AddVanityForm from "components_old/admin/AddVanityForm"
import RemoveVanityForm from "components_old/admin/RemoveVanityForm"
import { Metadata } from "next"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"

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
