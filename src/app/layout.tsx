import type { Metadata, Viewport } from "next"
import NextTopLoader from "nextjs-toploader"
import { getRaidHubApi } from "~/services/raidhub"
import { Footer } from "./Footer"
import { Header } from "./header/Header"
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
                <meta property="discord:site" content="https://discord.gg/raidhub" />
                <meta name="twitter:site" content="@raidhubio" />
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
                                        {/* <SearchModal /> */}
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
    "RaidHub is the world's leading Destiny 2 raid site. View dozens of leaderboards, millions of raid completions, and everything you need to know about Destiny 2"

export const metadata: Metadata = {
    title: title,
    description: description,
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
