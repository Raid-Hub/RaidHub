import { type Metadata } from "next"
import { revalidateTag } from "next/cache"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { AddVanityForm } from "./AddVanityForm"
import { RemoveVanityForm } from "./DeleteVanityForm"

export default async function Page() {
    const purgeManifest = async () => {
        "use server"
        revalidateTag("manifest")
    }

    return (
        <PageWrapper>
            <h1>Admin Panel</h1>
            <Flex $direction="column" $crossAxis="flex-start">
                <AddVanityForm />
                <RemoveVanityForm />
                <form action={purgeManifest}>
                    <button type="submit">Refresh Manifest (Purge cache)</button>
                </form>
            </Flex>
        </PageWrapper>
    )
}

export const metadata: Metadata = {
    title: "Admin Dashboard"
}
