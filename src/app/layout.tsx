import type { Metadata, Viewport } from "next"
import NextTopLoader from "nextjs-toploader"
import { type ReactNode } from "react"
import { getRaidHubApi } from "~/services/raidhub"
import { Footer } from "./(layout)/Footer"
import { Header } from "./(layout)/Header"
import { HeaderContent } from "./(layout)/HeaderContent"
import { SearchModal } from "./(layout)/SearchModal"
import { ClientManager } from "./(layout)/managers/ClientManager"
import { DestinyManifestManager } from "./(layout)/managers/DestinyManifestManager"
import { LocaleManager } from "./(layout)/managers/LocaleManager"
import { QueryManager } from "./(layout)/managers/QueryManager"
import { RaidHubManifestManager } from "./(layout)/managers/RaidHubManifestManager"
import { BungieClientProvider } from "./(layout)/managers/session/BungieClientProvider"
import { SessionManager } from "./(layout)/managers/session/SessionSessionManager"

export default async function RootLayout(params: { children: ReactNode }) {
    const manifest = await getRaidHubApi("/manifest", null, null, {
        next: { revalidate: 300 }
    })

    return (
        <html>
            <head>
                <meta name="discord:site" content="https://discord.gg/raidhub" />
                <meta name="twitter:site" content="@raidhubio" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <QueryManager>
                    <BungieClientProvider>
                        <SessionManager>
                            <LocaleManager>
                                <RaidHubManifestManager serverManifest={manifest}>
                                    <DestinyManifestManager>
                                        <ClientManager>
                                            <Header>
                                                <NextTopLoader
                                                    showSpinner={false}
                                                    speed={700}
                                                    height={3}
                                                    color={"orange"}
                                                />
                                                <HeaderContent />
                                            </Header>
                                            <SearchModal />
                                            {params.children}
                                            <Footer />
                                        </ClientManager>
                                    </DestinyManifestManager>
                                </RaidHubManifestManager>
                            </LocaleManager>
                        </SessionManager>
                    </BungieClientProvider>
                </QueryManager>
            </body>
        </html>
    )
}

export const preferredRegion = "iad1" // us-east-1
export const runtime = "nodejs"
export const revalidate = 3600 // static revalidation in seconds
export const maxDuration = 5 // max lambda duration in seconds

const title: Metadata["title"] = {
    absolute: "RaidHub",
    template: "%s | RaidHub"
}
const description: Metadata["description"] =
    "RaidHub is the fastest Destiny 2 raid analytics site. View dozens of leaderboards, millions of profiles, and millions of raid completions."

export const metadata: Metadata = {
    title: title,
    description: description,
    icons: {
        shortcut: "/favicon.ico"
    },
    robots: {
        follow: true,
        index: true
    },
    keywords: "destiny 2, raid, leaderboards, stats, statistics, worldsfirst, raidhub, report",
    metadataBase: new URL(
        process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : `https://localhost:${process.env.PORT ?? 3000}`
    ),
    openGraph: {
        title: title,
        description: description,
        images: ["/logo.png"],
        type: "website"
    },
    manifest: "/manifest.json"
}

export const viewport: Viewport = {
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
}
