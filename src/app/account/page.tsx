import { type Metadata } from "next"
import { type Provider } from "next-auth/providers"
import { Suspense } from "react"
import { metadata as rootMetaData } from "~/app/layout"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { Client } from "./Client"

export const revalidate = 20 * 60000

export default async function Page() {
    const providers = await fetch(
        new URL(
            "/api/auth/providers",
            process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : `https://localhost:${process.env.PORT ?? 3000}`
        )
    ).then(async (res): Promise<Record<string, Provider>> => {
        const data = res.json()
        if (res.ok) {
            return data
        } else {
            throw await data
        }
    })

    return (
        <PageWrapper>
            <Suspense>
                <Client providers={providers} />
            </Suspense>
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
