import AddVanityForm from "components_old/admin/AddVanityForm"
import RemoveVanityForm from "components_old/admin/RemoveVanityForm"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { metadata as rootMetaData } from "~/app/layout"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { getServerAuthSession } from "../api/auth"

export default async function Page() {
    const session = await getServerAuthSession()

    if (session?.user.role !== "ADMIN") {
        redirect("/")
    }

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
    title: "Admin",
    openGraph: {
        ...rootMetaData.openGraph,
        title: "Admin"
    }
}
