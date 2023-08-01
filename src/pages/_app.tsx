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
import ComponentCacheManager from "../components/app/ComponentCacheManager"
import ProgressBar from "nextjs-progressbar"
import SearchDiv from "../components/global/SearchDiv"

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
            </Head>
            <SessionProvider
                session={session}
                refetchInterval={sessionRefetchInterval}
                refetchOnWindowFocus={false}>
                <TokenManager setRefetchInterval={setSessionRefetchInterval}>
                    <DestinyManifestManager>
                        <SearchDiv />
                        <Header />
                        <ProgressBar
                            options={{
                                showSpinner: false,
                                parent: "#content"
                            }}
                            height={4}
                            showOnShallow={false}
                            color={"orange"}
                        />
                        <ComponentCacheManager Component={Component} componentProps={pageProps} />
                        <Footer />
                    </DestinyManifestManager>
                </TokenManager>
            </SessionProvider>
        </LocaleManager>
    )
}

export default App
