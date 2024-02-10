import Account from "components_old/account/Account"
import { type Metadata } from "next"
import { metadata as rootMetaData } from "~/app/layout"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { getServerAuthSession } from "~/server/api/auth"

export default async function Page() {
    const session = await getServerAuthSession()

    return (
        <PageWrapper>
            {!session ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    <h1>Welcome, {session.user.name}</h1>
                    <Account session={session} />
                </>
            )}
        </PageWrapper>
    )
}

export const metadata: Metadata = {
    title: "Account",
    openGraph: {
        ...rootMetaData.openGraph,
        title: "Account"
    }
}
