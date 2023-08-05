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
import DestinyManifestManager from "../components/app/DestinyManifestManager"
import ProgressBar from "nextjs-progressbar"
import SearchModal from "../components/global/SearchModal"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const reactQueryClient = new QueryClient()

type PageProps = {
    session: Session
}

function App({ Component, pageProps: { session, ...pageProps } }: AppProps<PageProps>) {
    const [sessionRefetchInterval, setSessionRefetchInterval] = useState(0)

    return (
        <LocaleManager>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1"
                />
                <title key="title">RaidHub</title>
                <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
                <link
                    href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro"
                    rel="stylesheet"
                />
            </Head>
            <QueryClientProvider client={reactQueryClient}>
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
                                height={4}
                                showOnShallow={false}
                                color={"orange"}
                            />
                            <SearchModal />
                            <Component {...pageProps} />
                            <Footer />
                        </DestinyManifestManager>
                    </TokenManager>
                </SessionProvider>
            </QueryClientProvider>
        </LocaleManager>
    )
}

export default App
