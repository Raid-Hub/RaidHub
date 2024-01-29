import { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import Header from "../components/global/Header"
import Footer from "../components/global/Footer"
import "../styles/globals.css"
import Head from "next/head"
import TokenManager from "../components/app/TokenManager"
import { useState } from "react"
import { Session } from "next-auth"
import LocaleManager from "../components/app/LocaleManager"
import ProgressBar from "nextjs-progressbar"
import SearchModal from "~/components/global/SearchModal"
import dynamic from "next/dynamic"
import { trpc } from "~/util/trpc"
import { LazyMotion } from "framer-motion"
import { RaidHubManifestManager } from "~/components/app/RaidHubManifestManager"
import Toolbox from "~/components/toolbox/Toolbox"
import { HeaderBanner } from "~/components/global/HeaderBanner"
import { Hydrate } from "@tanstack/react-query"

/** Allows us to offload the the import of dexie (indexdb tool) until necessary */
const DestinyManifestManager = dynamic(() =>
    import("../components/app/DestinyManifestManager").then(imp => imp.DestinyManifestManager)
)

/** Dynamically import framer-motion features */
const lazyMotionFeatures = () => import("../util/framer-motion-features").then(imp => imp.default)

type PageProps = {
    session: Session
    globalDehydratedState: unknown
    dotAppRedirect?: boolean
    serverRendered?: boolean
}

const title = "RaidHub"
const description =
    "RaidHub is the world's leading Destiny 2 raid site. View dozens of leaderboards, millions of raid completions, and everything you need to know about Destiny 2"

const RaidHub = ({
    Component,
    pageProps: { session, globalDehydratedState, ...pageProps },
    router
}: AppProps<PageProps>) => {
    const [sessionRefetchInterval, setSessionRefetchInterval] = useState(0)
    const [isFooterVisible, setIsFooterVisible] = useState(false)

    /* disables the prefetching behavior of next/link */
    router.prefetch = async (url, asPath, options) => {}

    return (
        <LocaleManager>
            {/* All meta tags should have keys to avoid duplication */}
            <Head>
                <title key="title">{title}</title>
                <meta key="description" name="description" content={description} />

                {/* Open Graph */}
                <meta key="og:site_name" property="og:site_name" content="RaidHub" />
                <meta key="og:site_type" property="og:type" content="website" />
                <meta key="og:title" property="og:title" content={title} />
                <meta key="og:image" property="og:image" content="/logo.png" />
                <meta key="og:description" property="og:description" content={description} />

                {/* Twitter */}
                <meta key="twitter:site" name="twitter:site" content="@raidhubapp" />
                <meta key="twitter:card" name="twitter:card" content="summary" />
                <meta key="twitter:image" name="twitter:image" content="/logo.png" />
                <meta key="twitter:title" name="twitter:title" content={title} />
                <meta key="twitter:description" name="twitter:description" content={description} />

                {/* Discord */}
                <meta
                    key="discord:site"
                    property="discord:site"
                    content="https://discord.gg/raidhub"
                />
                <meta key="theme-color" name="theme-color" content="#f0802f" />

                <meta
                    key="viewport"
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1"
                />
            </Head>
            <SessionProvider
                session={session}
                refetchInterval={sessionRefetchInterval}
                refetchOnWindowFocus={false}>
                <TokenManager setRefetchInterval={setSessionRefetchInterval}>
                    <DestinyManifestManager>
                        <RaidHubManifestManager>
                            <LazyMotion features={lazyMotionFeatures} strict>
                                <Header />
                                <ProgressBar
                                    options={{
                                        showSpinner: false,
                                        parent: "#header",
                                        trickle: true,
                                        speed: 700
                                    }}
                                    stopDelayMs={50}
                                    height={3}
                                    showOnShallow={false}
                                    color={"orange"}
                                />
                                <HeaderBanner />
                                <SearchModal />
                                <Component {...pageProps} />
                                <Toolbox isFooterVisible={isFooterVisible} />
                                <Footer setIsVisible={setIsFooterVisible} />
                            </LazyMotion>
                        </RaidHubManifestManager>
                    </DestinyManifestManager>
                </TokenManager>
            </SessionProvider>
        </LocaleManager>
    )
}
export default trpc.withTRPC(RaidHub)
