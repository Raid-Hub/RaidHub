import type { Metadata, Viewport } from "next"
import NextTopLoader from "nextjs-toploader"
import { getRaidHubApi } from "~/services/raidhub"
import { Footer } from "./layout/Footer"
import { Header } from "./layout/Header"
import { SearchModal } from "./layout/SearchModal"
import { FramerMotionManager } from "./managers/FramerMotionManager"
import { LocaleManager } from "./managers/LocaleManager"
import { QueryManager } from "./managers/QueryManager"
import { RaidHubManifestManager } from "./managers/RaidHubManifestManager"
import { SessionManager } from "./managers/SessionManager"
import { StyledComponentsManager } from "./managers/StyledComponentsManager"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const manifest = await getRaidHubApi("/manifest", null, null, { next: { revalidate: 300 } })

    return (
        <html>
            <head>
                <meta name="discord:site" content="https://discord.gg/raidhub" />
                <meta name="twitter:site" content="@raidhubio" />

                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <QueryManager>
                    <SessionManager>
                        <LocaleManager>
                            <RaidHubManifestManager serverManifest={manifest}>
                                <StyledComponentsManager>
                                    <FramerMotionManager>
                                        <Header />
                                        <NextTopLoader
                                            showSpinner={false}
                                            speed={700}
                                            height={3}
                                            color={"orange"}
                                        />
                                        <SearchModal />
                                        {children}
                                        <Footer />
                                    </FramerMotionManager>
                                </StyledComponentsManager>
                            </RaidHubManifestManager>
                        </LocaleManager>
                    </SessionManager>
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
    robots: {
        follow: true,
        index: true
    },
    keywords: "destiny 2, raid, leaderboards, stats, statistics, worldsfirst, raidhub, report",
    metadataBase: new URL(
        process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.DEV_PROXY
            ? `https://127.0.0.1:${process.env.PORT ?? 3000}`
            : `http://localhost:${process.env.PORT ?? 3000}`
    ),
    openGraph: {
        title: title,
        description: description,
        images: ["/logo.png"],
        type: "website"
    }
}

export const viewport: Viewport = {
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
}
