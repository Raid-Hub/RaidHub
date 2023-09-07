import type { AppProps } from "next/app"
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

/** Allows us to offload the the import of dexie (indexdb tool) until necessary */
const DestinyManifestManager = dynamic(() => import("../components/app/DestinyManifestManager"))

type PageProps = {
    session: Session
}

function App({ Component, pageProps: { session, ...pageProps } }: AppProps<PageProps>) {
    const [sessionRefetchInterval, setSessionRefetchInterval] = useState(0)

    return (
        <LocaleManager>
            <Head>
                <title key="title">RaidHub</title>
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
                        <Header />
                        <ProgressBar
                            options={{
                                showSpinner: false,
                                parent: "#header",
                                trickle: true,
                                speed: 700
                            }}
                            stopDelayMs={100}
                            height={3}
                            showOnShallow={false}
                            color={"orange"}
                        />
                        <SearchModal />
                        <Component {...pageProps} />
                        <Footer />
                    </DestinyManifestManager>
                </TokenManager>
            </SessionProvider>
        </LocaleManager>
    )
}

export default trpc.withTRPC(App)
