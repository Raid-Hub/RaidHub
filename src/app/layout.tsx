import type { Metadata, Viewport } from "next"
import dynamic from "next/dynamic"
import NextTopLoader from "nextjs-toploader"
import { type ReactNode } from "react"
import { Footer } from "~/app/layout/Footer"
import { Header } from "~/app/layout/Header"
import { HeaderContent } from "~/app/layout/HeaderContent"
import { SearchModal } from "~/app/layout/SearchModal"
import {
    BungieClientProvider,
    ClientManager,
    LocaleManager,
    QueryManager,
    RaidHubManifestManager
} from "~/app/layout/managers"
import { SessionManager } from "~/app/layout/managers/session/ServerSessionManager"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { DonationBanner } from "./layout/DonationBanner"
import { ServiceStatusBanner } from "./layout/ServiceStatusBanner"
import "./layout/global.css"

// Dynamic import for the dexie DB
const DestinyManifestManager = dynamic(() => import("~/app/layout/managers/DestinyManifestManager"))

export const preferredRegion = ["iad1"] // us-east-1
export const runtime = "nodejs"
export const fetchCache = "default-no-store"
export const revalidate = 0
export const maxDuration = 5 // max lambda duration in seconds

export default async function RootLayout(params: { children: ReactNode }) {
    const manifest = await prefetchManifest()

    return (
        <html>
            <head>
                <meta name="discord:site" content="https://discord.gg/raidhub" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <QueryManager>
                    <RaidHubManifestManager serverManifest={manifest}>
                        <BungieClientProvider>
                            <SessionManager>
                                <LocaleManager>
                                    <ClientManager>
                                        <DestinyManifestManager>
                                            <Header>
                                                <NextTopLoader
                                                    showSpinner={false}
                                                    speed={700}
                                                    height={3}
                                                    color={"orange"}
                                                />
                                                <HeaderContent />
                                            </Header>
                                            <DonationBanner />
                                            <ServiceStatusBanner />
                                            <SearchModal />
                                            {params.children}
                                            <Footer />
                                        </DestinyManifestManager>
                                    </ClientManager>
                                </LocaleManager>
                            </SessionManager>
                        </BungieClientProvider>
                    </RaidHubManifestManager>
                </QueryManager>
            </body>
        </html>
    )
}

const title: Metadata["title"] = {
    absolute: "RaidHub",
    template: "%s | RaidHub"
}
const description: Metadata["description"] =
    "RaidHub is the fastest Destiny 2 raid analytics site. View dozens of leaderboards, millions of profiles, and millions of raid completions."

export const metadata = {
    title: title,
    description: description,
    icons: {
        shortcut: "/favicon.ico"
    },
    robots: {
        follow: true,
        index: true
    },
    keywords: [
        "destiny 2",
        "raidhub",
        "raid hub",
        "raid",
        "leaderboards",
        "stats",
        "statistics",
        "worlds first"
    ],
    metadataBase: new URL(
        process.env.DEPLOY_URL ??
            (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : `https://localhost:${process.env.PORT ?? 3000}`)
    ),
    openGraph: {
        title: title,
        description: description,
        siteName: "RaidHub",
        images: ["/logo.png"] as string[] | undefined,
        type: "website"
    },
    twitter: {
        creator: "@raidhubio"
    }
}

export const viewport: Viewport = {
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
}
