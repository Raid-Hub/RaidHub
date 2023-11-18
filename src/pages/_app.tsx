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
import { CrawlableNextPage } from "~/types/generic"
import RaidHubMetaData from "~/components/reusable/CommonMetaData"

/** Allows us to offload the the import of dexie (indexdb tool) until necessary */
const DestinyManifestManager = dynamic(() =>
    import("../components/app/DestinyManifestManager").then(imp => imp.DestinyManifestManager)
)

/** Dynamically import framer-motion features */
const lazyMotionFeatures = () => import("../util/framer-motion-features").then(imp => imp.default)

type PageProps = {
    session: Session
    headOnly?: boolean
}

const title = "RaidHub"
const description =
    "RaidHub is the world's leading Destiny 2 raid site. View dozens of leaderboards, millions of raid completions, and everything you need to know about Destiny 2"

function RaidHub({
    Component,
    pageProps: { session, headOnly, ...pageProps },
    router
}: AppProps<PageProps>) {
    const [sessionRefetchInterval, setSessionRefetchInterval] = useState(0)

    /* disables the prefetching behavior of next/link */
    router.prefetch = async (url, asPath, options) => {}

    if (headOnly) {
        // @ts-ignore
        const ComponentHead = Component.Head as CrawlableNextPage<any, any>["Head"]
        return (
            <ComponentHead {...pageProps}>
                <RaidHubMetaData />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"
                />
            </ComponentHead>
        )
    }

    return (
        <LocaleManager>
            <Head>
                <title key="title">{title}</title>
                <meta name="description" content={description} key="description" />

                <RaidHubMetaData />

                <meta property="og:title" content={title} key="og-title" />
                <meta property="og:image" content="/logo.png" key="og-image" />
                <meta property="og:description" content={description} key="og-descriptions" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:image" content="/logo.png" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />

                <meta
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
                                <SearchModal />
                                <Component {...pageProps} />
                                <Footer />
                            </LazyMotion>
                        </RaidHubManifestManager>
                    </DestinyManifestManager>
                </TokenManager>
            </SessionProvider>
        </LocaleManager>
    )
}

export default trpc.withTRPC(RaidHub)
