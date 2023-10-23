import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import Header from "../components/global/Header"
import Footer from "../components/global/Footer"
import "../styles/globals.css"
import Head from "next/head"
import TokenManager from "../components/app/TokenManager"
import { useEffect, useState } from "react"
import { Session } from "next-auth"
import LocaleManager from "../components/app/LocaleManager"
import ProgressBar from "nextjs-progressbar"
import SearchModal from "~/components/global/SearchModal"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { trpc } from "~/util/trpc"
import { LazyMotion } from "framer-motion"
import { RaidHubManifestManager } from "~/components/app/RaidHubManifestManager"

/** Allows us to offload the the import of dexie (indexdb tool) until necessary */
const DestinyManifestManager = dynamic(() =>
    import("../components/app/DestinyManifestManager").then(imp => imp.DestinyManifestManager)
)

/** Dynamically import framer-motion features */
const lazyMotionFeatures = () => import("../util/framer-motion-features").then(imp => imp.default)

type PageProps = {
    session: Session
}

const title = "RaidHub"
const description =
    "RaidHub is the world's leading Destiny 2 raid site. View dozens of leaderboards, millions of raid completions, and everything you need to know about Destiny 2"

function App({ Component, pageProps: { session, ...pageProps } }: AppProps<PageProps>) {
    const [sessionRefetchInterval, setSessionRefetchInterval] = useState(0)

    const router = useRouter()

    /* disables the prefetching behavior of next/link, except for profile pages */
    useEffect(() => {
        const prefetch = router.prefetch
        router.prefetch = async (url, asPath, options) => {
            if (url.match(/\/profile\//)) {
                return prefetch(url, asPath, options)
            }
        }
    }, [router])

    return (
        <LocaleManager>
            <Head>
                <title key="title">{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
                <meta key="og-image" property="og:image" content="/logo.png" />
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

export default trpc.withTRPC(App)
